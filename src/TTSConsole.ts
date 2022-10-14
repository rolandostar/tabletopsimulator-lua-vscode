import * as vscode from 'vscode';

import * as BBCode from './BBCode';
import TTSAdapter from './TTSAdapter';

export default class TTSConsolePanel {
  public static currentPanel: TTSConsolePanel | undefined;
  public static readonly viewType = 'TTSConsole';
  private _disposables: vscode.Disposable[] = [];
  private commandMode = false;

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : undefined;

    // If we already have a panel, show it.
    if (TTSConsolePanel.currentPanel) {
      TTSConsolePanel.currentPanel._panel.reveal(column);
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      TTSConsolePanel.viewType,
      'Tabletop Simulator Console++',
      column || vscode.ViewColumn.One,
      getWebviewOptions(extensionUri),
    );

    TTSConsolePanel.currentPanel = new TTSConsolePanel(panel, extensionUri);
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    TTSConsolePanel.currentPanel = new TTSConsolePanel(panel, extensionUri);
  }

  private constructor(
    private readonly _panel: vscode.WebviewPanel,
    private readonly _extensionUri: vscode.Uri,
  ) {
    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.type) {
          case 'command':
            TTSAdapter.customMessage({ command: message.text });
            break;
          case 'input':
            TTSAdapter.customMessage(
              this.commandMode ? { command: message.text } : { input: message.text },
            );
            break;
          case 'done': {
            // this.executeWhenDone();
            break;
          }
          default:
            break;
        }
        if (this.commandMode) {
          if (['>', 'exit'].includes(message.text)) this.commandMode = false;
        } else if (['>', '>>', '>cmd'].includes(message.text)) this.commandMode = true;
      },
      null,
      this._disposables,
    );

    TTSConsolePanel.currentPanel = this;
  }

  public isVisible() {
    return this._panel.visible;
  }

  public appendToPanel(rawText: string | undefined, optional?: object) {
    if (!rawText) return;
    const htmlString = BBCode.parse(rawText);
    let msg = { command: 'append', htmlString };
    if (optional) msg = { ...msg, ...optional };
    this._panel.webview.postMessage(msg);
  }

  public clearPanel() {
    console.log('clearing panel');
    this._panel.webview.postMessage({ command: 'clear' });
  }

  public dispose() {
    TTSConsolePanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _update() {
    const webview = this._panel.webview;
    this._panel.webview.html = this._getHtmlForWebview(webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'assets', 'console.js'),
    );

    // Do the same for the stylesheet.
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'assets', 'reset.css'),
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'assets', 'vscode.css'),
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'assets', 'console.css'),
    );
    const codiconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        'node_modules',
        '@vscode/codicons',
        'dist',
        'codicon.css',
      ),
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();
    const consoleConfig = vscode.workspace.getConfiguration('ttslua.console');
    return `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <!--
                Use a content security policy to only allow loading styles/css extension directory,
                only allow scripts that have a specific nonce, and fonts from a specific site.
              -->
              <meta
                http-equiv="Content-Security-Policy"
                content="
                  default-src 'none';
                  style-src  ${webview.cspSource} https://fonts.googleapis.com 'unsafe-inline';
                  script-src ${webview.cspSource} 'nonce-${nonce}';
                  font-src   ${webview.cspSource} https://fonts.gstatic.com;
                "
              >
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              
              <style>
              :root {
                --ttslua-console-font-family: ${consoleConfig.get('fontFamily') as string};
                --ttslua-console-font-size: ${consoleConfig.get('fontSize') as number}px;
                --ttslua-console-input-height: ${consoleConfig.get('inputHeight') as number}px;
              }
              </style>
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
              <link href="https://fonts.googleapis.com/css2?family=Amaranth&family=Roboto+Mono&display=swap" rel="stylesheet" />
              <link href="${codiconsUri}" rel="stylesheet" />
              <link href="${styleResetUri}" rel="stylesheet" />
              <link href="${styleVSCodeUri}" rel="stylesheet" />
              <link href="${styleMainUri}" rel="stylesheet" />
              <script nonce="${nonce}" src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
              <title>Tabletop Simulator Console++</title>
          </head>
          <body>
            <div id="data"></div>
            <div id="commandInput">
              <input type="textbox" placeholder=">command"/>
              <button id="send">
                <i class="codicon codicon-chevron-right"></i>
              </button>
            </div>
            <button id="clear">
              <i class="codicon codicon-clear-all"></i>
            </button>
            <script
              id="mainScript"
              type="module"
              src="${scriptUri}"
              clearOnFocus="${consoleConfig.get('clearOnFocus')}">
            />
          </body>
          </html>`;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
  return {
    enableScripts: true,
    localResourceRoots: [
      vscode.Uri.joinPath(extensionUri, 'node_modules', '@vscode/codicons', 'dist'),
      vscode.Uri.joinPath(extensionUri, 'assets'),
    ],
  };
}
