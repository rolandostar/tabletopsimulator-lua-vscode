import { ErrorMessage, IncomingJsonObject, OutgoingJsonObject } from '@matanlurey/tts-editor';
import { SplitIO } from '@matanlurey/tts-expander';
import { SaveState } from '@matanlurey/tts-save-format/src/types';
import * as fs from 'fs';
import { glob } from 'glob';
import bundler from 'luabundle';
import { resolveModule } from 'luabundle/bundle/process';
import * as bundleErr from 'luabundle/errors';
import * as path from 'path';
import * as vscode from 'vscode';
import CustomExternalEditorApi from './CustomExternalEditorApi';
import TTSConsolePanel from './TTSConsole';
import TTSWorkDir from './TTSWorkDir';
import { handleBundleError, handleEmptyGlobalScript } from './utils/errorHandling';
import getConfig from './utils/getConfig';
import { getLuaSearchPatterns, getSearchPaths } from './utils/searchPaths';
import { uriExists } from './utils/simpleStat';
import { quickStatus } from './utils/status';
import { xtractGame } from './utils/xtractGame';
import * as ws from './vscode/workspace';

type OutgoingJsonObjectWithName = OutgoingJsonObject & { name: string };
type InGameObjectsList = {
  [key: string]: { name?: string; type?: string; iname?: string };
};

/**
 * TTS Adapter singleton
 */
export default class TTSAdapter extends vscode.Disposable {
  public static api = new CustomExternalEditorApi();
  private static _inGameObjects: InGameObjectsList = {};
  private static _lastSentScripts: OutgoingJsonObjectWithName[] = [];
  private static _disposables: vscode.Disposable[] = [];

  public static registerListeners() {
    TTSAdapter._disposables.push(
      new vscode.Disposable(
        TTSAdapter.api.on('pushingNewObject', e => {
          ws.addWorkDirToWorkspace(); // Attempt to open workdir (if not already)
          // TTSAdapter will add the new object to the suggestion list and open it in the editor
          if (TTSWorkDir.isDefault())
            TTSAdapter.writeFilesFromTTS(e.scriptStates, { single: true });
          else {
            // TODO: Different method of saving a single script to proper location
          }
        }),
      ),
      new vscode.Disposable(
        TTSAdapter.api.on('loadingANewGame', async e => {
          // Whenever a new game is loaded, we need to update the list of objects
          TTSAdapter.updateInGameObjectsList();
          ws.addWorkDirToWorkspace(); // Attempt to open workdir (if not already)
          // Retrieve scripts from this data if not in a git workdir
          // Because in a git workdir we get them from the save itself
          if (TTSWorkDir.isDefault()) TTSAdapter.writeFilesFromTTS(e.scriptStates);
        }),
      ),
      new vscode.Disposable(
        TTSAdapter.api.on('printDebugMessage', async e => {
          // Print all debug messages to console++
          TTSConsolePanel.currentPanel?.appendToPanel(e.message);
        }),
      ),
      new vscode.Disposable(
        TTSAdapter.api.on('errorMessage', async e => {
          // Also print error messages in console++ with a custom class
          TTSConsolePanel.currentPanel?.appendToPanel(e.errorMessagePrefix, {
            class: 'callout error',
          });
          TTSAdapter.goToTTSError(e).catch(err => {
            vscode.window.showErrorMessage(err.message);
          });
        }),
      ),
      new vscode.Disposable(
        TTSAdapter.api.on('customMessage', async e => {
          // Mostly unused
          // console.log('[TTSLua] Custom message from TTS:', e.customMessage);
        }),
      ),
      new vscode.Disposable(
        // Essential for executeLua to display return value
        TTSAdapter.api.on('returnMessage', async e => {
          const message = <string>e.returnValue;
          if (TTSConsolePanel.currentPanel?.isVisible()) {
            TTSConsolePanel.currentPanel.appendToPanel(message, {
              class: 'callout return',
            });
          } else vscode.window.showInformationMessage(message);
        }),
      ),
      new vscode.Disposable(
        TTSAdapter.api.on('gameSaved', async e => {
          const isAutoSave = e.savePath.includes('TS_AutoSave');
          if (getConfig('console.logSaves')) {
            // Print to console the current timestamp in hh:mm:ss padded format
            const d = new Date();
            const h = `${d.getHours()}`.padStart(2, '0');
            const m = `${d.getMinutes()}`.padStart(2, '0');
            const s = `${d.getSeconds()}`.padStart(2, '0');
            const timestamp = `${h}:${m}:${s}`;
            TTSConsolePanel.currentPanel?.appendToPanel(
              `[${timestamp}] ${isAutoSave ? '↩️ Game Autosaved' : '💾 Game Saved'}`,
              {
                class: 'save',
              },
            );
          }
          if (!TTSWorkDir.isDefault() && !isAutoSave) xtractGame(e.savePath);
        }),
      ),
      new vscode.Disposable(
        TTSAdapter.api.on('objectCreated', async e => {
          // Update the list of in-game objects when a new object is created
          TTSAdapter.updateInGameObjectsList();
        }),
      ),
    );
  }

  private static async updateInGameObjectsList() {
    // A single custom event will be sent with the list of objects
    TTSAdapter.api.once('customMessage').then(e => {
      const getObjectsMessage = <{ type: 'getObjects'; data: string }>e.customMessage;
      TTSAdapter._inGameObjects = JSON.parse(getObjectsMessage.data);
    });
    // Execute Lua
    await TTSAdapter.api.executeLuaCode(
      fs.readFileSync(path.join(__dirname, '../lua/getObjects.lua'), 'utf8'),
    );
  }

  /**
   * Requests a list of all scripts from the game
   */
  public static async getScripts() {
    // Ask TTS to send scripts
    const { savePath } = await TTSAdapter.api.getLuaScripts();
    // If not in a git workdir or user doens't want git native, that's all we gotta do
    if (TTSWorkDir.isDefault() || !getConfig('fileManagement.git.enabled')) return;
    // Otherwise, we will split the savegame
    xtractGame(savePath);
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
    /* This function collectScripts, will add objects to the list of OutgoingJsonObjects
     * @param scriptFileNames: string[] - List of absolute script file names. All must end with '.lua'
     */
    const objects: OutgoingJsonObjectWithName[] = [];
    const collectScripts = async (scriptFileNames: string[]) => {
      for (const scriptFilename of scriptFileNames) {
        const { name: scriptNameGuid, dir: scriptDir } = path.parse(scriptFilename);
        const [name, guid] = scriptNameGuid.split('.');
        const obj: OutgoingJsonObjectWithName = { guid, name };
        const scriptMger = new ws.FileManager(scriptFilename, false);
        const scriptContent = await scriptMger.read();
        // Attempt to bundle the script
        try {
          obj.script = bundler.bundleString(scriptContent, {
            paths: getSearchPaths(getLuaSearchPatterns()),
          });
        } catch (err) {
          return handleBundleError(err, scriptFilename);
        }
        // Let's check for XML
        try {
          const xmlMger = new ws.FileManager(path.join(scriptDir, `${scriptNameGuid}.xml`), false);
          obj.ui = await TTSAdapter.insertXmlFiles(await xmlMger.read());
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
    };

    // Save all files
    await vscode.workspace.saveAll(false);

    // Big If
    if (TTSWorkDir.isDefault()) {
      // If the workdir is the default, we can just send the scripts
      const wsFiles = await vscode.workspace.fs.readDirectory(workDirUri);
      // Filter to only apply to FileType.File and file extension .lua
      const scriptFiles = wsFiles
        .filter(file => file[1] === vscode.FileType.File && path.extname(file[0]) === '.lua')
        .map(file => vscode.Uri.joinPath(workDirUri, file[0]).fsPath);
      await collectScripts(scriptFiles);
    } else {
      // Git Workspace Save & Play Workflow
      // We don't know the save path, so we'll have to ask the game
      const { savePath } = await TTSAdapter.api.getLuaScripts();
      // Parse savePath to get save name
      const save: SaveState = JSON.parse(
        (await vscode.workspace.fs.readFile(vscode.Uri.file(savePath))).toString(),
      );
      // Consolitate workdir tree back to save json
      const splitter = new SplitIO();
      const saveFileJson = await splitter.readAndCollapse(
        path.join(
          TTSWorkDir.getFileUri(getConfig('fileManagement.git.output')).fsPath,
          save.SaveName + '.json',
        ),
      );
      // Write back to savePath
      const saveMger = new ws.FileManager(savePath, false);
      await saveMger.write(JSON.stringify(saveFileJson, null, 2));
      // Now we need to reload the game, we have to send all objects through external editor API
      // Parse the save we just wrote, to get the objects to be sent
      const newSave = await splitter.readSaveAndSplit(savePath);
      // First we add global
      objects.push({
        guid: '-1',
        name: 'Global',
        script: newSave.luaScript?.contents,
        ui: newSave.xmlUi?.contents,
      });
      // Then we add all the other objects
      await collectScripts(
        glob.sync('**/*.lua', {
          cwd: TTSWorkDir.getFileUri(
            path.join(getConfig('fileManagement.git.output'), save.SaveName),
          ).fsPath,
          absolute: true,
        }),
      );
    }

    // Validate empty global to avoid lockup
    const globalObj = objects.find(obj => obj.guid === '-1');
    if (globalObj === undefined || globalObj.script === '') return handleEmptyGlobalScript();

    TTSAdapter._lastSentScripts = objects;
    // TODO: Open edit according to config here!
    // TTSAdapter can throw beware
    TTSAdapter.api.saveAndPlay(objects);

    const statusBar = vscode.window.setStatusBarMessage(
      `$(cloud-upload) Sent ${objects.length} files`,
    );
    setTimeout(() => {
      statusBar.dispose();
    }, 1500);
    // Clear the console if configured to do so
    if (getConfig('console.clearOnReload')) TTSConsolePanel.currentPanel?.clearPanel();
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

    const script = TTSAdapter._lastSentScripts.find(obj => obj.guid === message.guid);
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
   * @param objects - State of all received scripts
   * @param options: { single: boolean } - Whether to only save a single file
   */
  private static async writeFilesFromTTS(
    objects: IncomingJsonObject[],
    options?: { single?: boolean },
  ) {
    // Read scriptStates, write them to files and determine which should be opened
    const filesRecvMgers: ws.FileManager[] = [];
    const statusBar = vscode.window.setStatusBarMessage('$(sync~spin) Receiving scripts');
    for (const obj of objects) {
      // Sanitize script name
      obj.name = obj.name.replace(/([":<>/\\|?*])/g, '');
      // XML File Creation
      // If the object received has UI Data or if user explicitly wants to create UI file for each.
      if (obj.ui || getConfig('fileManagement.createXML')) {
        const xmlMgers = new ws.FileManager(`${obj.name}.${obj.guid}.xml`);
        xmlMgers.write(
          // Replace <!-- include FILE --> with <Include src="FILE"/>
          obj.ui?.replace(
            /(<!--\s+include\s+([^\s].*)\s+-->)[\s\S]+?\1/g,
            (_matched, _open, src) => `<Include src="${src}"/>`,
          ) ?? '',
        );
        filesRecvMgers.push(xmlMgers);
      }
      // Lua File Creation
      const luaMgers = new ws.FileManager(`${obj.name}.${obj.guid}.lua`);
      try {
        // Let's attempt to unbundle
        const data = bundler.unbundleString(obj.script);
        const { content } = data.modules[data.metadata.rootModuleName];
        // If unbundle was successful, write the file with the unbundled content
        if (content !== '') luaMgers.write(content);
      } catch (err: unknown) {
        // Unbundle may fail if the script wasn't previously bundled, in that case, just write the script
        // If the failure is for any other reason, then throw it
        if (!(err instanceof bundleErr.NoBundleMetadataError)) {
          vscode.window.showErrorMessage((err as Error).message);
          throw err;
        }
        luaMgers.write(obj.script);
      }
      filesRecvMgers.push(luaMgers);
    }

    const autoOpen = vscode.workspace
      .getConfiguration('ttslua.fileManagement')
      .get('autoOpen') as string;
    // If it's not a single script, syncFiles and trigger autoOpen
    if (!options?.single) {
      await ws.syncFiles(filesRecvMgers.map(m => m.getUri()));
      switch (autoOpen) {
        case 'All':
          filesRecvMgers.forEach(m => m.open());
          break;
        case 'Global':
          new ws.FileManager(`Global.-1.lua`).open();
          break;
      }
      // If it's a single, open it in preview mode
      // Single will never carry UI so it's safe to assume the first and only manager is the lua one
    } else filesRecvMgers[0].open({ preview: true });
    statusBar.dispose();
    quickStatus(`$(cloud-download) Received ${filesRecvMgers.length} scripts from TTS`);
  }

  public static executeSelectedLua(script?: string, guid?: string) {
    // Get Current selection from vscode
    const editor = vscode.window.activeTextEditor;
    // If no editor is open, fail silently
    if (!editor) return;
    if (!script && !guid) {
      script = editor.document.getText(editor.selection);
      guid = path.basename(editor.document.fileName).split('.')[1];
      // TODO: validate guid against ingame object list
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
    TTSAdapter.api.executeLuaCode(script, guid);
  }

  /* In-Game Objects are read only for everyone but TTSAdapter */
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
    text = text.replace(/<!--[\s\S]*?-->/g, comment => {
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
          if (!(await uriExists(vscode.Uri.file(lookupPath)))) continue;
          // try {
          //   await vscode.workspace.fs.stat(vscode.Uri.file(lookupPath));
          // } catch (err) {
          //   if ((err as vscode.FileSystemError).code !== 'FileNotFound') {
          //     vscode.window.showErrorMessage(`Error reading ${lookupPath}: ${err}`);
          //     throw err;
          //   }
          //   // If it doesn't, just try with the next one
          //   continue;
          // }
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

  public static dispose() {
    while (TTSAdapter._disposables.length) {
      const x = TTSAdapter._disposables.pop();
      if (x) {
        x.dispose();
      }
    }

    TTSAdapter.api.close();
    console.log('[TTSLua] Resources disposed');
  }
}
