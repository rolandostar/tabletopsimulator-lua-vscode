import { ErrorMessage, IncomingJsonObject, OutgoingJsonObject } from '@matanlurey/tts-editor';
import * as fs from 'fs';
import bundler from 'luabundle';
import { resolveModule } from 'luabundle/bundle/process';
import * as bundleErr from 'luabundle/errors';
import * as path from 'path';
import * as vscode from 'vscode';
import CustomExternalEditorApi from './CustomExternalEditorApi';
import { handleBundleError } from './ErrorHandling';
import TTSConsolePanel from './TTSConsole';
import TTSWorkDir from './TTSWorkDir';
import { getLuaSearchPatterns, getSearchPaths } from './utils/searchPaths';
import * as ws from './vscode/workspace';

type OutgoingJsonObjectWithName = OutgoingJsonObject & { name: string };
type InGameObjectsList = {
  [key: string]: { name?: string; type?: string; iname?: string };
};

/**
 * TTS Adapter singleton
 */
export default abstract class TTSAdapter extends vscode.Disposable {
  private static _api = new CustomExternalEditorApi();
  private static _inGameObjects: InGameObjectsList = {};
  private static _lastSentScripts: OutgoingJsonObjectWithName[] = [];
  private static _disposables: vscode.Disposable[] = [];

  public static registerListeners() {
    TTSAdapter._disposables.push(
      new vscode.Disposable(
        TTSAdapter._api.on('pushingNewObject', (e) => {
          ws.addWorkDirToWorkspace(); // Attempt to open workdir (if not already)
          // TTSAdapter will add the new object to the suggestion list and open it in the editor
          TTSAdapter.readFilesFromTTS(e.scriptStates, { single: true });
        }),
      ),
      new vscode.Disposable(
        TTSAdapter._api.on('loadingANewGame', async (e) => {
          // Whenever a new game is loaded, we need to update the list of objects
          TTSAdapter.updateInGameObjectsList();
          ws.addWorkDirToWorkspace(); // Attempt to open workdir (if not already)
          TTSAdapter.readFilesFromTTS(e.scriptStates);
        }),
      ),
      new vscode.Disposable(
        TTSAdapter._api.on('printDebugMessage', async (e) => {
          // Print all debug messages to console++
          TTSConsolePanel.currentPanel?.appendToPanel(e.message);
        }),
      ),
      new vscode.Disposable(
        TTSAdapter._api.on('errorMessage', async (e) => {
          // Also print error messages in console++ with a custom class
          TTSConsolePanel.currentPanel?.appendToPanel(e.errorMessagePrefix, {
            class: 'callout error',
          });
          TTSAdapter.goToTTSError(e).catch((err) => {
            vscode.window.showErrorMessage(err.message);
          });
        }),
      ),
      new vscode.Disposable(
        TTSAdapter._api.on('customMessage', async (e) => {
          // Mostly unused, let's just print it for now
          console.log('[TTSLua] Custom message from TTS:', e.customMessage);
        }),
      ),
      new vscode.Disposable(
        // Essential for executeLua to display return value
        TTSAdapter._api.on('returnMessage', async (e) => {
          const message = <string>e.returnValue;
          if (TTSConsolePanel.currentPanel?.isVisible()) {
            TTSConsolePanel.currentPanel.appendToPanel(message, {
              class: 'callout return',
            });
          } else vscode.window.showInformationMessage(message);
        }),
      ),
      new vscode.Disposable(
        TTSAdapter._api.on('gameSaved', async (e) => {
          if (vscode.workspace.getConfiguration('ttslua.console').get('logSaves')) {
            // Print to console the current timestamp in hh:mm:ss padded format
            const d = new Date();
            const h = `${d.getHours()}`.padStart(2, '0');
            const m = `${d.getMinutes()}`.padStart(2, '0');
            const s = `${d.getSeconds()}`.padStart(2, '0');
            const timestamp = `${h}:${m}:${s}`;
            TTSConsolePanel.currentPanel?.appendToPanel(`[${timestamp}] 💾 Game Saved`, {
              class: 'save',
            });
          }
          // Store the last save path for the download command
          // I think its not needed since we can getLuaScripts from asset downloader now
          // LocalStorageService.setValue('lastSavePath', e.savePath);
          if (!TTSWorkDir.isDefault()) {
            //  TODO: TTSAdapter should probably trigger a savegame split instead
            const saveName = vscode.workspace
              .getConfiguration('ttslua.fileManagement')
              .get('saveName');
            await vscode.workspace.fs.copy(
              vscode.Uri.file(path.normalize(e.savePath)),
              TTSWorkDir.getFileUri(saveName + '.json'),
              { overwrite: true },
            );
            vscode.window.showInformationMessage('SaveGame Copied to WorkDir');
          }
        }),
      ),
      new vscode.Disposable(
        TTSAdapter._api.on('objectCreated', async (e) => {
          // Update the list of in-game objects when a new object is created
          TTSAdapter.updateInGameObjectsList();
        }),
      ),
    );
  }

  private static async updateInGameObjectsList() {
    // A single custom event will be sent with the list of objects
    TTSAdapter._api.once('customMessage').then((e) => {
      const getObjectsMessage = <{ type: 'getObjects'; data: string }>e.customMessage;
      TTSAdapter._inGameObjects = JSON.parse(getObjectsMessage.data);
    });
    // Execute Lua
    await TTSAdapter._api.executeLuaCode(
      fs.readFileSync(path.join(__dirname, '../lua/getObjects.lua'), 'utf8'),
    );
  }

  /**
   * Requests a list of all scripts from the game
   */
  public static getScripts() {
    TTSAdapter._api.getLuaScripts().catch((err) => {
      if (err.code === 'EADDRINUSE')
        vscode.window.showErrorMessage('Another instance of TTSLua or Atom is already running', {
          modal: true,
          detail: 'Please close the other instance and try again.',
        });
      else console.error('[TTSLua] Unexpected Server Error:', err);
    });
  }

  /**
   * Sends all Scripts to the game
   */
  public static async saveAndPlay() {
    // When sending scripts, the Temp folder must be present in workspace
    const workDirUri = TTSWorkDir.getUri();
    if (!ws.isPresent(workDirUri)) {
      vscode.window.showErrorMessage(
        'The workspace does not contain the Tabletop Simulator folder.\n' +
          'Get Lua Scripts from game before trying to Save and Play.',
        { modal: true },
      );
      return;
    }
    // Save all files
    await vscode.workspace.saveAll(false);

    // Big If
    const objects: OutgoingJsonObjectWithName[] = [];
    if (TTSWorkDir.isDefault()) {
      // If the workdir is the default, we can just send the scripts
      const wsFiles = await vscode.workspace.fs.readDirectory(workDirUri);
      // Filter to only apply to FileType.File and file extension .lua
      const scriptFiles = wsFiles
        .filter((file) => file[1] === vscode.FileType.File && path.extname(file[0]) === '.lua')
        .map((file) => file[0]);
      for (const scriptFilename of scriptFiles) {
        const [name, guid] = scriptFilename.split('.');
        const obj: OutgoingJsonObject & { name: string } = { guid, name };
        const scriptContent = (await TTSWorkDir.readFile(scriptFilename)).toString();
        // Attempt to bundle the script
        try {
          obj.script = bundler.bundleString(scriptContent, {
            paths: getSearchPaths(getLuaSearchPatterns()),
          });
        } catch (err) {
          handleBundleError(err, scriptFilename);
          return;
        }
        // Let's check for XML
        try {
          const filetext = await TTSWorkDir.readFile(
            `${path.basename(scriptFilename, '.lua')}.xml`,
          );
          obj.ui = await TTSAdapter.insertXmlFiles(filetext.toString());
        } catch (err) {
          if ((err as vscode.FileSystemError).code !== 'FileNotFound') {
            vscode.window.showErrorMessage(
              `Error while reading XML file for ${scriptFilename}:\n${err}`,
            );
            return;
          }
        }
        objects.push(obj);
      }

      // Validate empty global to avoid lockup
      const globalObj = objects.find((obj) => obj.guid === '-1');
      if (globalObj === undefined || globalObj.script === '') {
        vscode.window
          .showErrorMessage('Global Script must not be empty', 'Learn More')
          .then((selection) => {
            if (selection === 'Learn More')
              vscode.env.openExternal(
                vscode.Uri.parse('https://tts-vscode.rolandostar.com/support/globalScriptLock'),
              );
          });
        return;
      }
    } else {
      // TODO: Git Workspace Save & Play Workflow
    }

    TTSAdapter._lastSentScripts = objects;
    // TODO: Open edit according to config here!
    // TTSAdapter can throw beware
    TTSAdapter._api.saveAndPlay(objects);

    const statusBar = vscode.window.setStatusBarMessage(
      `$(cloud-upload) Sent ${objects.length} files`,
    );
    setTimeout(() => {
      statusBar.dispose();
    }, 1500);
    // Clear the console if configured to do so
    if (vscode.workspace.getConfiguration('ttslua.console').get('clearOnReload'))
      TTSConsolePanel.currentPanel?.clearPanel();
  }

  /**
   * Shows an error from TTS and a button to jump to the line it came from
   * @param message - Error Message received from TTS
   */
  private static async goToTTSError(message: ErrorMessage): Promise<vscode.TextEditor | undefined> {
    // Confirm that message.error exists
    // If the error is from Execute Lua or no pattern found, no button is needed
    const match = message.error.match(/.*:\((\d*),(\d*)-(\d*)\):/) ?? null;
    if (message.errorMessagePrefix.search(/.*function <exec.*/) >= 0 || !match) {
      // not a jumpable error message, show it and return
      vscode.window.showErrorMessage(message.error);
      return;
    }
    // Extract components
    const [, line, startChar, endChar] = match;
    // Parse as Int to form Error Range
    const lineNum = parseInt(line, 10);
    const startCharNum = parseInt(startChar, 10);
    const endCharNum = parseInt(endChar, 10);
    const errorRange = new vscode.Range(lineNum - 1, startCharNum, lineNum - 1, endCharNum);

    // Show Button to User
    const option = await vscode.window.showErrorMessage(message.error, 'Go to Error');
    if (!option) return; // Dismissed
    if (!TTSAdapter._lastSentScripts) {
      vscode.window.showErrorMessage(
        'Unable to locate Error. Make sure you have sent scripts first with Save & Play',
      );
      return;
    }

    const script = TTSAdapter._lastSentScripts.find((obj) => obj.guid === message.guid);
    if (!script) throw Error('No such script loaded.');
    try {
      // Will throw if file isn't bundled
      const unbundled = bundler.unbundleString(script.script || '');
      const modules = Object.values(unbundled.modules);
      for (const m of modules) {
        const mRange = new vscode.Range(m.start.line, m.start.column, m.end.line, m.end.column);
        if (mRange.contains(errorRange)) {
          let uri: vscode.Uri;
          if (m.name === unbundled.metadata.rootModuleName) {
            uri = TTSWorkDir.getFileUri(`${script.name}.${script.guid}.lua`);
          } else {
            // Find the file the same way we did when we bundled it
            const path = resolveModule(m.name, getSearchPaths(getLuaSearchPatterns()));
            if (!path) throw Error('Module containing error not found in search paths.');
            uri = vscode.Uri.file(path);
          }

          return vscode.window.showTextDocument(uri, {
            selection: new vscode.Range(
              errorRange.start.line - mRange.start.line + 1,
              errorRange.start.character,
              errorRange.end.line - mRange.start.line + 1,
              errorRange.end.character,
            ),
          });
        }
      }
      return;
    } catch (err: unknown) {
      if (!(err instanceof bundleErr.NoBundleMetadataError)) throw err;
      // file wasn't bundled, no complexity needed
      return vscode.window.showTextDocument(
        TTSWorkDir.getFileUri(`${script.name}.${script.guid}.lua`),
        { selection: errorRange },
      );
    }
  }

  /**
   * Creates files into workspace from received scriptStates
   * @param scriptStates - State of all received scripts
   */
  private static async readFilesFromTTS(
    scriptStates: IncomingJsonObject[],
    options?: { single?: boolean },
  ) {
    // Read scriptStates, write them to files and determine which should be opened
    const filesRecv: ws.FileHandler[] = [];
    const globalHandlers: ws.FileHandler[] = [];
    const autoOpen = vscode.workspace
      .getConfiguration('ttslua.fileManagement')
      .get('autoOpen') as string;
    const createXml = vscode.workspace
      .getConfiguration('ttslua.fileManagement')
      .get('createXML') as boolean;
    // TTSAdapter would create a status bar with spinning icon, but it finishes too fast to see :(
    /* let statusBar = wd.setStatusBarMessage('$(sync~spin) Receiving scripts'); */
    if (scriptStates) {
      for (const scriptState of scriptStates) {
        // Sanitize script name
        scriptState.name = scriptState.name.replace(/([":<>/\\|?*])/g, '');
        // XML File Creation
        // If the file received has UI Data or if user explicitly wants to create UI file for each.
        if (scriptState.ui || createXml) {
          const xmlHandler = new ws.FileHandler(`${scriptState.name}.${scriptState.guid}.xml`);
          await xmlHandler.write(
            scriptState.ui?.replace(
              /(<!--\s+include\s+([^\s].*)\s+-->)[\s\S]+?\1/g,
              (_matched, _open, src) => `<Include src="${src}"/>`,
            ) ?? '',
          );
          // if (scriptState.name === 'Global') globalHandlers.push(handler);
          filesRecv.push(xmlHandler);
        }
        // Lua File Creation
        // First create the file as-is
        const luaHandler = new ws.FileHandler(`${scriptState.name}.${scriptState.guid}.lua`);
        await luaHandler.write(scriptState.script);
        try {
          // Then, attempt to unbundle
          const data = bundler.unbundleString(scriptState.script);
          const { content } = data.modules[data.metadata.rootModuleName];
          // If unbundle was successful, overwrite the file with the unbundled content
          if (content !== '') await luaHandler.write(content);
        } catch (err: unknown) {
          // If unbundle failed for any reason other than no metadata, make it known. Be silent otherwise.
          if (!(err instanceof bundleErr.NoBundleMetadataError)) {
            vscode.window.showErrorMessage((err as Error).message);
            throw err;
          }
        }
        if (scriptState.name === 'Global') globalHandlers.push(luaHandler);
        filesRecv.push(luaHandler);
      }
    }
    // Remove files not marked as received from the workFolder.
    // If a single object was pushed, do not remove files.
    if (!options?.single) {
      await ws.syncFiles(filesRecv);
      switch (autoOpen) {
        case 'All':
          filesRecv.forEach((handler) => handler.open());
          break;
        case 'Global':
          globalHandlers.forEach((handler) => handler.open());
          break;
        case 'None':
        default:
          break;
      }
    } else filesRecv[0].open({ preview: true });

    const statusBar = vscode.window.setStatusBarMessage(
      `$(cloud-download) Received ${Object.keys(filesRecv).length} scripts from TTS`,
    );
    setTimeout(() => statusBar.dispose(), 1500);
  }

  /**
   * Sends a message to the game
   * @param messageID - Type of message to be sent
   * @param object - Mutable object according to type
   */
  // private async sendToTTS(messageID: TTSTypes.TxMsgType, object?: object) {
  //   if (await !TTSAdapter.isServerRunning()) return;
  //   const statusBar = vscode.window.setStatusBarMessage('$(sync~spin) Connecting to TTS');
  //   const client = net.connect(39999, 'localhost', () => {
  //     client.write(JSON.stringify({ messageID, ...object }));
  //     statusBar.dispose();
  //     client.destroy();
  //   });
  //   client.on('error', (err: NodeJS.ErrnoException) => {
  //     if (err.code === 'ECONNREFUSED') {
  //       statusBar.dispose();
  //       vscode.window.showErrorMessage(
  //         'Unable to connect to Tabletop Simulator.\n\n' +
  //           'Check that the game is running and a save has been loaded.',
  //         { modal: true },
  //       );
  //     } else console.error(`[TTSLua] Net Client ${err}`);
  //   });
  //   client.on('end', () => client.destroy());
  // }

  public static executeSelectedLua(script?: string, guid?: string) {
    // Get Current selection from vscode
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    if (!script && !guid) {
      script = editor.document.getText(editor.selection);
      guid = path.basename(editor.document.fileName).split('.')[1];
    } else if (!script || !guid) {
      console.error('Script or GUID not provided');
      return;
    }
    // Check that script is defined and not empty
    if (script === '') {
      vscode.window.showErrorMessage('No script selected');
      return;
    }
    // Send to TTS
    TTSAdapter._api.executeLuaCode(script, guid);
  }

  public static getInGameObjects() {
    return TTSAdapter._inGameObjects;
  }

  /**
   * Recursive XML Include
   * @param text - Text to be replaced
   * @param alreadyInserted - Tracking array to prevent cyclical includes
   */
  private static async insertXmlFiles(
    text: string | Uint8Array,
    alreadyInserted: string[] = [],
  ): Promise<string> {
    if (typeof text !== 'string') text = Buffer.from(text).toString('utf-8');
    const pattern = /(^|\n)([\s]*)(.*)<Include\s+src=('|")(.+)\4\s*\/>/;
    const getNonce = () => Math.random().toString(36).substring(7);
    const nonce = getNonce();
    // First we extract comments and leave a placeholder, so we don't try to parse them
    // Remember to store them for reinsertion later
    const comments: string[] = [];
    text = text.replace(/<!--[\s\S]*?-->/g, (comment) => {
      comments.push(comment);
      return `<!--${nonce}:${comments.length - 1}-->`;
    });
    // Then we perform the actual replacement

    // Split text by lines
    const lines = text.split(/\r?\n/);
    // Iterate each line
    for (const [index, line] of lines.entries()) {
      // If line contains an include (with regex)
      const match = line.match(pattern);
      if (match) {
        const [, pre, indent, before, , insertPath] = match;
        const prefix = pre + indent + before;
        const marker = `<!-- include ${insertPath} -->`;
        const possiblePaths = getSearchPaths([insertPath]);
        // Try to open each possible path, and insert the first one that works
        for (const lookupPath of possiblePaths) {
          // Check if the file exists before attempting to open it
          try {
            await vscode.workspace.fs.stat(vscode.Uri.file(lookupPath));
          } catch (err) {
            if ((err as vscode.FileSystemError).code !== 'FileNotFound') {
              vscode.window.showErrorMessage(`Error reading ${lookupPath}: ${err}`);
              throw err;
            }
            // If it doesn't, just try with the next one
            continue;
          }
          // Found an existing file, so open it
          const moduleUri = vscode.Uri.file(lookupPath);
          const moduleContent = await vscode.workspace.fs.readFile(moduleUri);
          if (moduleContent.length > 0) {
            // If the file has already been inserted, skip it
            if (alreadyInserted.includes(lookupPath)) {
              vscode.window.showErrorMessage(
                `Cyclical include detected. ${insertPath} was previously included`,
              );
              lines[index] = line.replace(pattern, prefix);
              break;
            }
            // File hasn't been inserted yet.
            alreadyInserted.push(lookupPath);
            const newText = await TTSAdapter.insertXmlFiles(moduleContent, alreadyInserted);
            const content = newText.replace('\n', `\n${indent}`);
            lines[index] = line.replace(
              pattern,
              `${prefix + marker}\n${indent}${content}\n${indent}${marker}`,
            );
            break;
          }
          // Went through all possible paths but no return yet. Inform of error
          vscode.window.showErrorMessage(
            `Could not catalog <Include /> - file not found: ${insertPath}`,
          );
          lines[index] = line.replace(pattern, `${prefix + marker}\n${indent}${marker}`);
        }
      }
    }

    // Reinsert comments
    return lines
      .join('\n')
      .replace(new RegExp(`<!--${nonce}:(\\d+)-->`, 'g'), (_match, index) => comments[index]);
  }

  /**
   * Sends a custom structured object
   * @param object - Table to be sent to game
   */
  public static customMessage(object: unknown) {
    TTSAdapter._api.customMessage(object);
  }

  public static dispose() {
    while (TTSAdapter._disposables.length) {
      const x = TTSAdapter._disposables.pop();
      if (x) {
        x.dispose();
      }
    }

    TTSAdapter._api.close();
    console.log('[TTSLua] Resources disposed');
  }
}
