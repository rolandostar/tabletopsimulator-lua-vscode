/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import * as net from 'net';
import {
  workspace as ws,
  window as wd,
  Webview,
  WebviewPanel,
  Uri,
  FileType,
  ViewColumn,
  Range,
  TextEditor,
} from 'vscode';
import { join, posix } from 'path';
import bundle from 'luabundle';
import { NoBundleMetadataError } from 'luabundle/errors';
import { resolveModule } from 'luabundle/bundle/process';
import { readFileSync } from 'fs';

import parse from './bbcode/tabletop';
import { tempFolder, docsFolder, FileHandler } from './filehandler';

/**
 * Shape of data received from TTS
 */
interface TTSMessage {
  messageID: RxMsgType,
  scriptStates?: ScriptState[],
  message?: string,
  error?: string,
  guid?: string,
  errorMessagePrefix?: string,
  customMessage?: object,
  returnValue?: boolean,
  script?: string
}

/**
 * Shape of every object received
 */
interface ScriptState {
  name: string,
  guid: string,
  script: string,
  ui?: string
}

/**
 * Types of messages that can be received
 */
enum RxMsgType {
  ObjectPushed,
  NewGame,
  Print,
  Error,
  CustomMessage,
  Return,
  GameSaved,
  ObjectCreated,
}

/**
 * Types of messages that can be sent
 */
enum TxMsgType {
  GetScripts,
  SaveAndPlay,
  CustomMessage,
  ExecuteLua,
}

/**
 * Forms an array with directory paths where to look for files to be included
 * @param searchPattern - Pattern divided by `;` to form paths with
 */
function getSearchPaths(searchPattern: string[]): string[] {
  const paths: string[] = [];
  const config = ws.getConfiguration('TTSLua');
  const includeOtherFilesPaths = config.get('includeOtherFilesPaths') as string[];
  searchPattern.filter((pattern) => pattern.length > 0).map((pattern) => [
    join(docsFolder, pattern),
    ...includeOtherFilesPaths.map((p) => join(p, pattern)) || null,
    ...ws.workspaceFolders!.map((val) => join(val.uri.fsPath, pattern)) || null,
    pattern, // For absolute paths
  ]).map((combo) => paths.push(...combo));
  return paths;
}

export default class TTSAdapter {
  private tempUri: Uri;

  private disposables: any = [];

  private extensionPath: string;

  private savedAndPlayed: boolean = false;

  private server: any;

  private executeWhenDone = () => { };

  private webviewPanel: WebviewPanel | null = null;

  private commandMode: boolean = false;

  private lastSentScripts: { [key: string]: ScriptState } | undefined;

  /**
   * Builds new TTSAdapter instance
   * @param extensionPath - Path where the extension is running, should be passed down from context
   */
  public constructor(extensionPath: string) {
    this.tempUri = Uri.file(tempFolder);
    this.extensionPath = extensionPath;
    this.initServer();
  }

  /**
   * Starts a server where Tabletop will send data to
   * @param port - Port where server will bind to. Defaults to `39998`
   */
  public initServer(port: number = 39998) {
    this.server = net.createServer((socket: net.Socket) => {
      const chunks: any = [];
      // Set timeout in case of unexpected connection drop
      socket.setTimeout(10000);
      socket.on('timeout', () => socket.end());
      socket.on('data', (chunk) => chunks.push(chunk));
      socket.on('end', () => {
        this.handleMessage(JSON.parse(Buffer.concat(chunks).toString()) as TTSMessage);
        socket.end();
      });
    });
    this.server.on('listening', () => console.debug('[TTSLua] Server open.'));
    this.server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[TTSLua] Port ${port} is in use, retrying...`);
        setTimeout(() => {
          this.server.close();
          this.server.listen(port, 'localhost');
        }, 1000);
      } else console.error(`[TTSLua] Error: ${err}`);
    });
    this.server.listen(port, 'localhost'); // Open Server
  }

  /**
   * Retrieves scripts from currently open savegame
   */
  public async getScripts() {
    const vsFolders = ws.workspaceFolders;
    if (!vsFolders || vsFolders.findIndex((dir) => dir.uri.fsPath === this.tempUri.fsPath) === -1) {
      ws.updateWorkspaceFolders(vsFolders ? vsFolders.length : 0, null, { uri: this.tempUri });
    }
    TTSAdapter.sendToTTS(TxMsgType.GetScripts);
  }

  /**
   * Sends all Scripts to the game
   */
  public async saveAndPlay() {
    // When sending scripts, the Temp folder must be present in workspace
    const vsFolders = ws.workspaceFolders;
    if (!vsFolders || vsFolders.findIndex((dir) => dir.uri.fsPath === this.tempUri.fsPath) === -1) {
      wd.showErrorMessage(
        'The workspace does not contain the Tabletop Simulator folder.\n'
        + 'Get Lua Scripts from game before trying to Save and Play.',
        { modal: true },
      );
      return;
    }
    // This would create a status bar with spinning icon, but it finishes too fast to see :(
    /* let statusBar = wd.setStatusBarMessage('$(sync~spin) Sending scripts'); */
    // Save all documents in the workspace
    try { await ws.saveAll(false); } catch (reason: any) {
      console.error(`Unable to save opened files.\nDetail: ${reason}`);
      return;
    }
    // Read files contained in the Temp folder
    let files: [string, FileType][];
    try { files = await ws.fs.readDirectory(this.tempUri); } catch (reason: any) {
      wd.showErrorMessage(
        'Unable to read TTS Scripts directory.\n'
        + `Details: ${reason}`,
      );
      return;
    }
    // For each file in Temp folder, create the LuaString to be sent
    const scripts: { [key: string]: ScriptState } = {};
    for (let i = 0; i < files.length; i += 1) {
      const [file, filetype] = files[i];
      const fileUri = this.tempUri.with({ path: posix.join(this.tempUri.path, file) });
      // Skip directories
      if (filetype !== FileType.Directory) {
        const [name, guid] = file.split('.');
        if (!(guid in scripts)) scripts[guid] = { name, guid, script: '' };
        // Complete the script placeholder with the content of the file, bundling when needed
        if (file.endsWith('.lua')) {
          scripts[guid].script = Buffer.from(await ws.fs.readFile(fileUri)).toString('utf-8');
          const config = ws.getConfiguration('TTSLua');
          if (config.get('includeOtherFiles')) {
            try {
              scripts[guid].script = bundle.bundleString(scripts[guid].script, {
                paths: getSearchPaths(config.get('bundleSearchPattern') as string[]),
                isolate: true,
                rootModuleName: file,
              });
            } catch (error: any) {
              wd.showErrorMessage(error.message);
              console.error(error.stack);
            }
          }
        } else if (file.endsWith('.xml')) {
          scripts[guid].ui = TTSAdapter.insertXmlFiles(await ws.fs.readFile(fileUri));
        }
      }
    }
    // Validate empty global to avoid corruption
    if (scripts['-1'].script === '') {
      wd.showErrorMessage('Global Script must not be empty');
      return;
    }

    this.lastSentScripts = scripts;

    // Once the scripts content has been built, send to game
    // Depending on config, send after clearing panel (Hack)
    this.executeWhenDone = () => {
      this.savedAndPlayed = true;
      TTSAdapter.sendToTTS(TxMsgType.SaveAndPlay, { scriptStates: [...Object.values(scripts)] });
      const statusBar = wd.setStatusBarMessage(`$(cloud-upload) Sent ${files.length} files`);
      setTimeout(() => { statusBar.dispose(); }, 1500);
      // Single-fire autodestructs function after being called
      this.executeWhenDone = function executeWhenDone() { };
    };
    if (ws.getConfiguration('TTSLua').get('clearOnReload')) this.clearPanel();
    else this.executeWhenDone();
  }

  /**
   * Sends a custom structured object
   * @param object - Table to be sent to game
   */
  public static customMessage(object: any) {
    TTSAdapter.sendToTTS(TxMsgType.CustomMessage, { customMessage: object });
  }

  /**
   * Executes arbitrary lua
   * @param script - Lua Script to be executed
   * @param guid - GUID of object from where lua will execute
   */
  public static executeLuaCode(script: string, guid: string = '-1') {
    TTSAdapter.sendToTTS(TxMsgType.ExecuteLua, { guid, script });
  }

  /**
   * Calls corresponding function according to message type
   * @param ttsMessage - Message received from TTS
   */
  private handleMessage(ttsMessage: TTSMessage) {
    switch (ttsMessage.messageID) {
      case RxMsgType.ObjectPushed:
        this.readFilesFromTTS(ttsMessage.scriptStates!, true);
        break;
      case RxMsgType.NewGame:
        if (!this.savedAndPlayed) this.readFilesFromTTS(ttsMessage.scriptStates!);
        this.savedAndPlayed = false;
        break;
      case RxMsgType.Print:
        this.appendToPanel(parse(ttsMessage.message!));
        break;
      case RxMsgType.Error:
        this.appendToPanel(ttsMessage.errorMessagePrefix, { class: 'error' });
        this.goToTTSError(ttsMessage)
          .catch((err) => wd.showErrorMessage(err.message));
        break;
      case RxMsgType.CustomMessage: break; // Can be used instead of print for console++
      case RxMsgType.Return: break; // Not implemented
      case RxMsgType.GameSaved:
        if (ws.getConfiguration('TTSLua').get('logSave')) {
          const d = new Date();
          const h = `${d.getHours()}`.padStart(2, '0');
          const m = `${d.getMinutes()}`.padStart(2, '0');
          const s = `${d.getSeconds()}`.padStart(2, '0');
          const timestamp = `${h}:${m}:${s}`;
          this.appendToPanel(`[${timestamp}] 💾 Game Saved`);
        }
        break;
      case RxMsgType.ObjectCreated: break; // Not Implemented
      default: break;
    }
  }

  /**
   * Shows an error from TTS and a button to jump to the line it came from
   * @param message - Error Message received from TTS
   */
  private async goToTTSError(message: TTSMessage): Promise<TextEditor | undefined> {
    const text = message.errorMessagePrefix! + message.error!;
    const re = /:\((?<line>\d*),(?<startChar>\d*)-(?<endChar>\d*)\):/;
    const m = re.exec(message.error!);
    if (!m) { // not a jumpable error message, just show it
      wd.showErrorMessage(text);
      return undefined;
    }
    const line = parseInt(m.groups!.line, 10);
    const startChar = parseInt(m.groups!.startChar, 10);
    const endChar = parseInt(m.groups!.endChar, 10);

    const errorRange = new Range(line - 1, startChar, line - 1, endChar);

    const option = await wd.showErrorMessage(text, 'Go to Error');
    if (!option) return undefined;
    if (!this.lastSentScripts) throw Error('No saved scripts found.');

    const script = this.lastSentScripts[message.guid!];
    if (!script) throw Error('No such script loaded.');
    try {
      const unbundled = bundle.unbundleString(script.script);

      const modules = Object.values(unbundled.modules);
      for (let i = 0; i < modules.length; i += 1) {
        const module = modules[i];
        const moduleRange = new Range(
          module.start.line,
          module.start.column,
          module.end.line,
          module.end.column,
        );

        if (moduleRange.contains(errorRange)) {
          const config = ws.getConfiguration('TTSLua');
          const path = resolveModule(
            module.name,
            getSearchPaths(config.get('bundleSearchPattern') as string[]),
          );
          if (!path) throw Error('Module containing error not found in search paths.');

          return wd.showTextDocument(Uri.file(path), {
            selection: new Range(
              moduleRange.start.line - errorRange.start.line + 1,
              errorRange.start.character,
              moduleRange.start.line - errorRange.end.line + 1,
              errorRange.end.character,
            ),
          });
        }
      }
    } catch (err: unknown) {
      if (!(err instanceof NoBundleMetadataError)) throw err;
      const basename = `${script.name}.${script.guid}.lua`;
      const uri = this.tempUri.with({ path: posix.join(this.tempUri.path, basename) });

      return wd.showTextDocument(uri, {
        selection: errorRange,
      });
    }
    throw Error('Encountered problem finding error line.');
  }

  /**
   * Creates files into workspace from received scriptStates
   * @param scriptStates - State of all received scripts
   * @param previewFlag - If true, will open files in editor
   */
  private async readFilesFromTTS(scriptStates: ScriptState[], previewFlag: boolean = false) {
    // Read scriptStates, write them to files and determine which should be opened
    const toOpen: FileHandler[] = [];
    const filesRecv: { [key: string]: boolean } = {};
    const autoOpen = ws.getConfiguration('TTSLua').get('autoOpen');
    const createXml = ws.getConfiguration('TTSLua').get('createXml');
    // This would create a status bar with spinning icon, but it finishes too fast to see :(
    /* let statusBar = wd.setStatusBarMessage('$(sync~spin) Receiving scripts'); */
    if (autoOpen === 'All') previewFlag = true;
    if (scriptStates) {
      scriptStates.forEach((scriptState) => {
        // Sanitize script name
        scriptState.name = scriptState.name.replace(/([":<>/\\|?*])/g, '');
        // XML File Creation
        if (scriptState.ui || createXml) {
          const basename = `${scriptState.name}.${scriptState.guid}.xml`;
          const handler = new FileHandler(basename);
          if (scriptState.ui) {
            handler.create(scriptState.ui.replace(
              /(<!--\s+include\s+([^\s].*)\s+-->)[\s\S]+?\1/g,
              (matchedText, marker, path) => `<Include src="${path.replace('"', '\\"')}"/>`,
            ));
          } else handler.create('');
          if (previewFlag) toOpen.push(handler);
          filesRecv[basename] = true;
        }
        // Lua File Creation
        const basename = `${scriptState.name}.${scriptState.guid}.lua`;
        const handler = new FileHandler(basename);
        let fileContent = scriptState.script;
        try {
          const data = bundle.unbundleString(scriptState.script);
          const { content } = data.modules[data.metadata.rootModuleName];
          if (content !== '') { fileContent = content; }
        } catch (reason: any) { console.error(`Problem unbundling script: ${reason}`); }
        handler.create(fileContent);
        if (autoOpen === scriptState.name || previewFlag) { toOpen.push(handler); }
        filesRecv[basename] = true;
      });
    }
    // Remove files not received.
    if (!previewFlag) {
      const files = await ws.fs.readDirectory(this.tempUri);
      await Promise.all(files.filter(([file]) => !(file in filesRecv)).map(([file]) => {
        const fileUri = this.tempUri.with({ path: posix.join(this.tempUri.path, file) });
        return ws.fs.delete(fileUri);
      }));
    }
    // Open all pending files
    Promise.all(toOpen.map((file) => file.open())).then(() => {
    }, (err: Error) => {
      console.error(`Unable to open files: ${err.message}`);
    });
    const statusBar = wd.setStatusBarMessage(
      `$(cloud-download) Received ${Object.keys(filesRecv).length} files`,
    );
    setTimeout(() => { statusBar.dispose(); }, 1500);
  }

  /**
   * Sends a message to the game
   * @param messageID - Type of message to be sent
   * @param object - Mutable object according to type
   */
  private static async sendToTTS(messageID: TxMsgType, object?: object) {
    const statusBar = wd.setStatusBarMessage('$(sync~spin) Connecting to TTS');
    const client = net.connect(39999, 'localhost', () => {
      client.write(JSON.stringify({ messageID, ...object }));
      statusBar.dispose();
      client.destroy();
    });
    client.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'ECONNREFUSED') {
        statusBar.dispose();
        wd.showErrorMessage('Unable to connect to Tabletop Simulator.\n\n'
          + 'Check that the game is running and a save has been loaded.\n'
          + 'If the problem persists, try using the "Save & Play" button '
          + 'in the in-game Modding tab.', { modal: true });
      } else console.error(`[TTSLua] Net Client ${err}`);
    });
    client.on('end', () => client.destroy());
  }

  /**
   * Create and show a webview panel, if it already exists just show it
   */
  public createOrShowPanel() {
    const column = wd.activeTextEditor
      ? ViewColumn.Beside
      : undefined;
    // If a panel exists, show it.
    if (this.webviewPanel) {
      this.webviewPanel.reveal(column);
      return;
    }
    // Otherwise, create it
    const panel = wd.createWebviewPanel(
      'TTSConsole',
      'Tabletop Simulator Console++',
      column || ViewColumn.One,
      {
        enableScripts: true, // Enable javascript in the webview
        localResourceRoots: [
          Uri.file(join(this.extensionPath, 'assets', 'webView')),
        ],
        retainContextWhenHidden: true,
      },
    );
    this.webviewPanel = this.webviewPanelInit(panel);
  }

  /**
   * Sets the content for a webview panel
   * @param wp - Panel to be initialized
   */
  private webviewPanelInit(wp: WebviewPanel) {
    wp.webview.html = this.getHtmlForWebview(wp.webview); // Set webview content
    wp.onDidDispose(() => this.disposePanel(), null, this.disposables);
    wp.onDidChangeViewState(() => {
      if (wp.visible) wp.webview.html = this.getHtmlForWebview(wp.webview);
    }, null, this.disposables);
    // Handle messages from the webview
    wp.webview.onDidReceiveMessage((message: { type: string, text: string }) => {
      switch (message.type) {
        case 'command':
          TTSAdapter.customMessage({ command: message.text });
          break;
        case 'input':
          TTSAdapter.customMessage(
            this.commandMode
              ? { command: message.text }
              : { input: message.text },
          );
          break;
        case 'done': {
          this.executeWhenDone();
          break;
        }
        default: break;
      }
      if (this.commandMode) {
        if (['>', 'exit'].includes(message.text)) this.commandMode = false;
      } else if (['>', '>>', '>cmd'].includes(message.text)) this.commandMode = true;
    }, null, this.disposables);
    return wp;
  }

  /**
   * Sets a new webviewpanel as current
   * @param webviewPanel - Panel to be reinitialized
   */
  public revivePanel(webviewPanel: WebviewPanel) {
    this.webviewPanel = this.webviewPanelInit(webviewPanel);
  }

  /**
   * Disposes of created panel
   */
  public disposePanel() {
    // Clean up our resources
    if (this.webviewPanel) {
      this.webviewPanel.dispose();
      this.webviewPanel = null;
    }

    while (this.disposables.length) {
      const x = this.disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  /**
   * Send a message to the webviewpanel
   * @param htmlString - String to send to panel
   * @param optional - Object for extra data
   * @remarks
   * Assumes panel is initialized
   */
  public appendToPanel(htmlString: string | undefined, optional?: object) {
    if (this.webviewPanel) {
      let msg = { command: 'append', htmlString };
      if (optional) msg = { ...msg, ...optional };
      this.webviewPanel.webview.postMessage(msg);
    }
  }

  /**
   * Clears panel of all messages
   */
  public clearPanel() {
    if (this.webviewPanel) {
      this.webviewPanel.webview.postMessage({ command: 'clear' });
    }
  }

  /**
   * Returns html string containing structure needed for Console++
   * @param webview - Webview to render to
   */
  private getHtmlForWebview(webview: Webview) {
    const config = ws.getConfiguration('TTSLua');
    const assetPath = join(this.extensionPath, 'assets', 'webView');
    const scriptFileUri = Uri.file(join(assetPath, 'js', 'console.js'));
    const styleFileUri = Uri.file(join(assetPath, 'css', 'console.css'));
    const scriptUri = scriptFileUri.with({ scheme: 'vscode-resource' });
    const styleUri = styleFileUri.with({ scheme: 'vscode-resource' });
    const { cspSource } = webview;
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
            :root {
              --ttslua-console-font-family: ${config.get('consoleFontFamily')};
              --ttslua-console-font-size: ${config.get('consoleFontSize')};
              --ttslua-console-input-height: ${config.get('consoleInputHeight')};
            }
            </style>
            <link rel="stylesheet" type="text/css" href="${styleUri}">
            <meta
              http-equiv="Content-Security-Policy"
              content="
                default-src 'none';
                img-src ${cspSource} https:;
                script-src ${cspSource} https:;
                style-src ${cspSource} 'unsafe-inline';
                font-src https:;
              "
            />
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
            <title>Tabletop Simulator Console++</title>
        </head>
        <body>
            <div id="commandInput">
              <input type="textbox" placeholder=">command"/>
            </div>
            <div id="data"></div>
            <script
              id="mainScript"
              type="module"
              src="${scriptUri}"
              clearOnFocus="${ws.getConfiguration('TTSLua').get('clearOnFocus')}">
            />
        </body>
        </html>`;
  }

  /**
   * Recursive XML Include
   * @param text - Text to be replaced
   * @param alreadyInserted - Tracking array to prevent cyclical includes
   * @remarks
   * Ported from Atom's Plugin
   */
  private static insertXmlFiles(text: string | Uint8Array, alreadyInserted: string[] = []): string {
    if (typeof text !== 'string') text = Buffer.from(text).toString('utf-8');
    return text.replace(/(^|\n)([\s]*)(.*)<Include\s+src=('|")(.+)\4\s*\/>/g,
      (matched, prefix, indentation, content, quote, insertPath): string => {
        prefix = prefix + indentation + content;
        const { path, filetext } = getSearchPaths([insertPath]).reduce((result, lookupPath) => {
          if (result.filetext.length > 0 || result.path.length > 0) return result;
          try {
            return { filetext: readFileSync(lookupPath).toString('utf-8'), path: lookupPath };
          } catch (error) {
            if (error.code !== 'ENOENT') throw error;
          }
          return { path: '', filetext: '' };
        }, { path: '', filetext: '' });
        const marker = `<!-- include ${insertPath} -->`;
        if (filetext.length > 0) {
          if (alreadyInserted.includes(path)) {
            wd.showErrorMessage(`Cyclical include detected. ${insertPath} was previously included`);
            return prefix;
          }
          alreadyInserted.push(path);
          const insertText = indentation + TTSAdapter.insertXmlFiles(filetext, alreadyInserted)
            .replace('\n', `\n${indentation}`);
          return `${prefix + marker}\n${insertText}\n${indentation}${marker}`;
        }
        wd.showErrorMessage(`Could not catalog <Include /> - file not found: ${insertPath}`);
        return `${prefix + marker}\n${indentation}${marker}`;
      });
  }
}
