import * as vscode from 'vscode';
import * as net from 'net';
import * as fs from 'fs';

import path = require('path');
import bundler from 'luabundle';
import {resolveModule} from 'luabundle/bundle/process';
import * as bundleErr from 'luabundle/errors';

import * as ws from '@/vscode/workspace';
import * as TTSTypes from '@/TTSTypes';
import TTSConsolePanel from '@/TTSConsole';
import TTSWorkDir from '@/vscode/TTSWorkDir';

type InGameObjectsList = {[key: string]: {name?: string; type?: string; iname?: string}};

/**
 * Forms an array with directory paths where to look for files to be included
 * @param searchPattern - Patterns array to form paths with
 */
function getSearchPaths(searchPattern: string[]): string[] {
  const includePaths: string[] =
    vscode.workspace.getConfiguration('ttslua.fileManagement').get('includePaths') || [];
  // Search pattern can be undefined, if it is
  const vsFolders = vscode.workspace.workspaceFolders || [];
  const paths = searchPattern
    .filter(pattern => pattern.length > 0)
    .map(pattern => [
      path.join(ws.docsFolder, pattern),
      ...includePaths.map(p => path.join(p, pattern)),
      ...vsFolders.map(val => path.join(val.uri.fsPath, pattern)),
      pattern, // For absolute paths
    ])
    // Flatten so all paths are in one top level array
    .reduce((acc, val) => acc.concat(val), []);
  // Flatten res
  if (vscode.workspace.getConfiguration('ttslua.misc').get('debugSearchPaths'))
    console.log('[TTSLua] Search Paths:\n->', paths.join('\n-> '), '\n');
  return paths;
}

/**
 * Returns a list patterns, validating that '?.lua' is always included
 */
function getLuaSearchPattern(): string[] {
  const pattern = vscode.workspace
    .getConfiguration('ttslua.fileManagement')
    .get('luaSearchPattern') as string[];
  if (!pattern.includes('?.lua')) pattern.push('?.lua');
  return pattern;
}

/**
 * TTS Adapter singleton
 */
export default class TTSAdapter extends vscode.Disposable {
  private static instance: TTSAdapter;
  private _inGameObjects: InGameObjectsList = {};
  private _serverPort = 39998;
  private _server: net.Server;
  private _lastSentScripts: {[key: string]: TTSTypes.ScriptState} = {};
  private _retIdCounter = 0;

  public static getInstance(): TTSAdapter {
    if (!TTSAdapter.instance) TTSAdapter.instance = new TTSAdapter();
    return TTSAdapter.instance;
  }

  /**
   * Creates a server to listen for messages from the game at init time
   */
  constructor() {
    super(() => this.dispose());
    this._server = net.createServer(socket => {
      const chunks: Buffer[] = [];
      socket.on('data', data => chunks.push(data));
      socket.on('close', () => {
        this.handleMessage(JSON.parse(chunks.join('').toString()));
      });
    });
    this.isServerRunning();
    TTSAdapter.instance = this;
  }

  /**
   * Converts asyncronouse listen function to Promise.
   * @returns Promise of server running state
   */
  private isServerRunning(): Promise<boolean> {
    return new Promise(resolve => {
      if (!this._server.listening)
        this._server
          .listen(this._serverPort, 'localhost')
          .once('listening', () => resolve(true))
          .once('error', (err: NodeJS.ErrnoException) => {
            if (err.code === 'EADDRINUSE')
              vscode.window.showErrorMessage(
                'Another instance of TTSLua or Atom is already running',
                {
                  modal: true,
                  detail: 'Please close the other instance and try again.',
                }
              );
            else console.error(`[TTSLua] Server ${err}`);
            resolve(false);
          });
      else resolve(true);
    });
  }

  /**
   * Sends a custom structured object
   * @param object - Table to be sent to game
   */
  public customMessage(object: unknown) {
    this.sendToTTS(TTSTypes.TxMsgType.CustomMessage, {customMessage: object});
  }

  /**
   * Requests a list of all scripts from the game
   */
  public getScripts() {
    this.sendToTTS(TTSTypes.TxMsgType.GetScripts);
  }

  /**
   * Sends all Scripts to the game
   */
  public async saveAndPlay() {
    // When sending scripts, the Temp folder must be present in workspace
    if (!ws.isPresent(TTSWorkDir.instance.getUri())) {
      vscode.window.showErrorMessage(
        'The workspace does not contain the Tabletop Simulator folder.\n' +
          'Get Lua Scripts from game before trying to Save and Play.',
        {modal: true}
      );
      return;
    }
    // Save all files
    await vscode.workspace.saveAll(false);
    // Read files contained in the Temp folder
    let files: [string, vscode.FileType][];
    try {
      files = await vscode.workspace.fs.readDirectory(TTSWorkDir.instance.getUri());
    } catch (reason: unknown) {
      vscode.window.showErrorMessage(
        'Unable to read TTS Scripts directory.\n' + `Details: ${reason}`
      );
      return;
    }

    // An indexed array is used to backreference the guids when parsing the UI portion
    const scripts: {[key: string]: TTSTypes.ScriptState} = {};
    for (const [file] of files.filter(([file]) => file.endsWith('.lua'))) {
      const [name, guid] = file.split('.');
      const fileContents = (await TTSWorkDir.instance.readFile(file)).toString();
      try {
        scripts[guid] = {
          name,
          guid,
          script: bundler.bundleString(fileContents, {
            paths: getSearchPaths(getLuaSearchPattern()),
            isolate: true,
            rootModuleName: file,
          }),
        };
      } catch (err) {
        if (err instanceof bundleErr.ModuleResolutionError) {
          vscode.window
            .showErrorMessage(
              `Unable to find module "${err.moduleName}" from ${err.parentModuleName}<${err.line}:${err.column}>\n`,
              'Learn More',
              'Enable Debug'
            )
            .then(selection => {
              if (selection === 'Learn More')
                vscode.env.openExternal(
                  vscode.Uri.parse(
                    'https://tts-vscode.rolandostar.com/support/debuggingModuleResolution'
                  )
                );
              else if (selection === 'Enable Debug') {
                if (!vscode.workspace.getConfiguration('ttslua.misc').get('debugSearchPaths')) {
                  vscode.workspace
                    .getConfiguration('ttslua.misc')
                    .update('debugSearchPaths', true, vscode.ConfigurationTarget.Global);
                  vscode.commands.executeCommand('workbench.action.toggleDevTools');
                  console.log(
                    '[TTSLua] Search Paths debug enabled, this window will now output the search paths when attempting to resolve modules.'
                  );
                } else {
                  vscode.window
                    .showInformationMessage(
                      'Search Paths debug is already enabled',
                      'Toggle DevTools'
                    )
                    .then(selection => {
                      if (selection === 'Toggle DevTools')
                        vscode.commands.executeCommand('workbench.action.toggleDevTools');
                    });
                }
              }
            });
          return;
        } else if (err instanceof SyntaxError) {
          const e = err as unknown as TTSTypes.BundleSyntaxError;
          const option = await vscode.window.showErrorMessage(
            `Syntax Error in ${file}${err.message}`,
            'Go to Error'
          );
          if (!option) return;
          await vscode.window.showTextDocument(TTSWorkDir.instance.getFileUri(file)),
            {
              selection: new vscode.Range(e.line - 1, e.column, e.line, 0),
            };
          return;
        }
        vscode.window.showErrorMessage(`${name}:\n${err}`);
        return;
      }
    }
    // Iterate over found scripts, and check if UI file exists
    for (const guid in scripts) {
      const script = scripts[guid];
      // Check if file exists with same name and guid
      await TTSWorkDir.instance.readFile(`${script.name}.${script.guid}.xml`).then(
        // If Found, add it to the script state object under `ui`
        fileContents => (scripts[guid].ui = TTSAdapter.insertXmlFiles(fileContents.toString())),
        reason => {
          if (reason.code !== 'FileNotFound') {
            vscode.window.showErrorMessage(`Error reading UI file for ${script.name}:\n${reason}`);
          }
        }
      );
    }
    // Validate empty global to avoid lockup
    if (scripts['-1'] === undefined || scripts['-1'].script === '') {
      vscode.window
        .showErrorMessage('Global Script must not be empty', 'Learn More')
        .then(selection => {
          if (selection === 'Learn More')
            vscode.env.openExternal(
              vscode.Uri.parse('https://tts-vscode.rolandostar.com/support/globalScriptLock')
            );
        });
      return;
    }
    // Do the sending
    this._lastSentScripts = scripts;
    this.sendToTTS(TTSTypes.TxMsgType.SaveAndPlay, {
      scriptStates: [...Object.values(scripts)],
    });
    // Update status bar
    const statusBar = vscode.window.setStatusBarMessage(
      `$(cloud-upload) Sent ${files.length} files`
    );
    setTimeout(() => {
      statusBar.dispose();
    }, 1500);
    // Clear the console if configured to do so
    if (vscode.workspace.getConfiguration('ttslua.console').get('clearOnReload'))
      TTSConsolePanel.currentPanel?.clearPanel();
  }

  /**
   * Calls corresponding function according to message type
   * @param rawMessage - Message received from TTS
   */
  private handleMessage(rawMessage: TTSTypes.GenericTTSMessage) {
    // console.log('[TTSLua] Received message:');
    // console.log(rawMessage);
    switch (rawMessage.messageID) {
      case TTSTypes.RxMsgType.ObjectPushed: {
        const ttsMessage = <TTSTypes.ObjectPushedMessage>rawMessage;
        ws.addWorkDirToWorkspace();
        // add guid to suggestion
        this.readFilesFromTTS(ttsMessage.scriptStates, {single: true});
        break;
      }

      case TTSTypes.RxMsgType.NewGame: {
        const ttsMessage = <TTSTypes.NewGameMessage>rawMessage;
        // if (!this.savedAndPlayed)
        this.requestObjectGUIDs();
        ws.addWorkDirToWorkspace();
        this.readFilesFromTTS(ttsMessage.scriptStates);
        // this.savedAndPlayed = false;
        break;
      }

      case TTSTypes.RxMsgType.PrintDebug: {
        const ttsMessage = <TTSTypes.PrintDebugMessage>rawMessage;
        TTSConsolePanel.currentPanel?.appendToPanel(ttsMessage.message);
        break;
      }

      case TTSTypes.RxMsgType.Error: {
        const ttsMessage = <TTSTypes.ErrorMessage>rawMessage;
        TTSConsolePanel.currentPanel?.appendToPanel(ttsMessage.errorMessagePrefix, {
          class: 'callout error',
        });
        this.goToTTSError(ttsMessage).catch(err => vscode.window.showErrorMessage(err.message));
        break;
      }

      case TTSTypes.RxMsgType.CustomMessage: {
        const ttsMessage = <TTSTypes.CustomMessage>rawMessage;
        const content = JSON.parse(ttsMessage.customMessage.content);
        switch (ttsMessage.customMessage.type) {
          // Process guids for autocompletion
          case 'guids': {
            this._inGameObjects = content;
            break;
          }
          default: {
            console.log('Unknown custom message type');
          }
        }
        break;
      }

      case TTSTypes.RxMsgType.Return: {
        const ttsMessage = <TTSTypes.ReturnMessage>rawMessage;
        if (TTSConsolePanel.currentPanel?.isVisible()) {
          TTSConsolePanel.currentPanel?.appendToPanel(ttsMessage.returnValue, {
            class: 'callout return',
          });
        } else vscode.window.showInformationMessage(ttsMessage.returnValue);
        break;
      }

      case TTSTypes.RxMsgType.GameSaved:
        if (vscode.workspace.getConfiguration('ttslua.console').get('logSaves')) {
          const d = new Date();
          const h = `${d.getHours()}`.padStart(2, '0');
          const m = `${d.getMinutes()}`.padStart(2, '0');
          const s = `${d.getSeconds()}`.padStart(2, '0');
          const timestamp = `${h}:${m}:${s}`;
          TTSConsolePanel.currentPanel?.appendToPanel(`[${timestamp}] 💾 Game Saved`, {
            class: 'save',
          });
        }
        // TODO: Add option to save files to disk when work dir is not default
        // if (ws.isGitEnabled) {
        //   // Copy save game to work folder
        // }
        break;

      case TTSTypes.RxMsgType.ObjectCreated: {
        const ttsMessage = <TTSTypes.ObjectCreatedMessage>rawMessage;
        // Add it to the guid suggestions if not already
        if (this._inGameObjects[ttsMessage.guid]) return;
        this._inGameObjects[ttsMessage.guid] = {};
        break;
      }

      default:
        break;
    }
  }

  /**
   * Shows an error from TTS and a button to jump to the line it came from
   * @param message - Error Message received from TTS
   */
  private async goToTTSError(
    message: TTSTypes.ErrorMessage
  ): Promise<vscode.TextEditor | undefined> {
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
    if (!this._lastSentScripts) {
      vscode.window.showErrorMessage(
        'Unable to locate Error. Make sure you have sent scripts first with Save & Play'
      );
      return;
    }

    const script = this._lastSentScripts[message.guid];
    if (!script) throw Error('No such script loaded.');
    try {
      // Will throw if file isn't bundled
      const unbundled = bundler.unbundleString(script.script);
      const modules = Object.values(unbundled.modules);
      for (const m of modules) {
        const mRange = new vscode.Range(m.start.line, m.start.column, m.end.line, m.end.column);
        if (mRange.contains(errorRange)) {
          let uri: vscode.Uri;
          if (m.name === unbundled.metadata.rootModuleName) {
            uri = TTSWorkDir.instance.getFileUri(`${script.name}.${script.guid}.lua`);
          } else {
            // Find the file the same way we did when we bundled it
            const path = resolveModule(m.name, getSearchPaths(getLuaSearchPattern()));
            if (!path) throw Error('Module containing error not found in search paths.');
            uri = vscode.Uri.file(path);
          }

          return vscode.window.showTextDocument(uri, {
            selection: new vscode.Range(
              errorRange.start.line - mRange.start.line + 1,
              errorRange.start.character,
              errorRange.end.line - mRange.start.line + 1,
              errorRange.end.character
            ),
          });
        }
      }
      return;
    } catch (err: unknown) {
      if (!(err instanceof bundleErr.NoBundleMetadataError)) throw err;
      // file wasnt bundled, no complexity needed
      return vscode.window.showTextDocument(
        TTSWorkDir.instance.getFileUri(`${script.name}.${script.guid}.lua`),
        {selection: errorRange}
      );
    }
  }

  /**
   * Creates files into workspace from received scriptStates
   * @param scriptStates - State of all received scripts
   */
  private async readFilesFromTTS(
    scriptStates: TTSTypes.ScriptState[],
    options?: {single?: boolean}
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
    // This would create a status bar with spinning icon, but it finishes too fast to see :(
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
              match => `<Include src="${match[2].replace('"', '\\"')}"/>`
            ) ?? ''
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
          const {content} = data.modules[data.metadata.rootModuleName];
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
          filesRecv.forEach(handler => handler.open());
          break;
        case 'Global':
          globalHandlers.forEach(handler => handler.open());
          break;
        case 'None':
        default:
          break;
      }
    } else filesRecv[0].open({preview: true});

    const statusBar = vscode.window.setStatusBarMessage(
      `$(cloud-download) Received ${Object.keys(filesRecv).length} scripts from TTS`
    );
    setTimeout(() => statusBar.dispose(), 1500);
  }

  /**
   * Sends a message to the game
   * @param messageID - Type of message to be sent
   * @param object - Mutable object according to type
   */
  private async sendToTTS(messageID: TTSTypes.TxMsgType, object?: object) {
    if (await !this.isServerRunning()) return;
    const statusBar = vscode.window.setStatusBarMessage('$(sync~spin) Connecting to TTS');
    const client = net.connect(39999, 'localhost', () => {
      client.write(JSON.stringify({messageID, ...object}));
      statusBar.dispose();
      client.destroy();
    });
    client.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'ECONNREFUSED') {
        statusBar.dispose();
        vscode.window.showErrorMessage(
          'Unable to connect to Tabletop Simulator.\n\n' +
            'Check that the game is running and a save has been loaded.',
          {modal: true}
        );
      } else console.error(`[TTSLua] Net Client ${err}`);
    });
    client.on('end', () => client.destroy());
  }

  executeLua(script?: string, guid?: string) {
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
    this.sendToTTS(TTSTypes.TxMsgType.ExecuteLua, {script, guid, returnID: this._retIdCounter++});
  }

  getInGameObjects() {
    return this._inGameObjects;
  }

  // REVIEW
  /**
   * Recursive XML Include
   * @param text - Text to be replaced
   * @param alreadyInserted - Tracking array to prevent cyclical includes
   * @remarks
   * Ported from Atom's Plugin
   */
  private static insertXmlFiles(text: string | Uint8Array, alreadyInserted: string[] = []): string {
    if (typeof text !== 'string') text = Buffer.from(text).toString('utf-8');
    return text.replace(
      /(^|\n)([\s]*)(.*)<Include\s+src=('|")(.+)\4\s*\/>/g,
      (_matched, prefix, indentation, content, _quote, insertPath): string => {
        prefix = prefix + indentation + content;
        const {path, filetext} = getSearchPaths([insertPath]).reduce(
          (result, lookupPath) => {
            if (result.filetext.length > 0 || result.path.length > 0) return result;
            try {
              // const filetext = fs.readFileSync(lookupPath).toString('utf-8');
              vscode.workspace.fs.readFile(vscode.Uri.file(lookupPath)).then(filetext => {
                return {
                  filetext,
                  path: lookupPath,
                };
              });
            } catch (error) {
              if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
            }
            return {path: '', filetext: ''};
          },
          {path: '', filetext: ''}
        );
        const marker = `<!-- include ${insertPath} -->`;
        if (filetext.length > 0) {
          if (alreadyInserted.includes(path)) {
            vscode.window.showErrorMessage(
              `Cyclical include detected. ${insertPath} was previously included`
            );
            return prefix;
          }
          alreadyInserted.push(path);
          const insertText =
            indentation +
            TTSAdapter.insertXmlFiles(filetext, alreadyInserted).replace('\n', `\n${indentation}`);
          return `${prefix + marker}\n${insertText}\n${indentation}${marker}`;
        }
        vscode.window.showErrorMessage(
          `Could not catalog <Include /> - file not found: ${insertPath}`
        );
        return `${prefix + marker}\n${indentation}${marker}`;
      }
    );
  }

  private requestObjectGUIDs() {
    // read file from disk
    this.sendToTTS(TTSTypes.TxMsgType.ExecuteLua, {
      guid: '-1',
      script: fs.readFileSync(path.join(__dirname, '../lua/requestObjectGUIDs.lua'), 'utf8'),
    });
  }

  public dispose() {
    if (this._server) this._server.close();
    console.log('Server disposed');
  }
}
