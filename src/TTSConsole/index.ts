import {
  type Disposable,
  type Webview,
  type WebviewPanel,
  window,
  Uri,
  ViewColumn
} from 'vscode'
import L from '@/i18n'
import getExtensionUri from '@/utils/getExtensionUri'
import getNonce from '@/utils/getNonce'
import { readFileSync as fsReadFileSync } from 'fs'
import getConfig from '@/utils/getConfig'
import BBCodeParse from '@/TTSConsole/bbcode'

export default class TTSConsolePanel {
  public static currentPanel: TTSConsolePanel | undefined
  private static readonly extensionUri: Uri = getExtensionUri()
  private readonly _disposables: Disposable[] = []

  private constructor (
    private readonly _panel: WebviewPanel) {
    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => { this.dispose() }, null, this._disposables)

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(
      this._panel.webview,
      TTSConsolePanel.extensionUri
    )

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview)
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   */
  public static render (): void {
    const column = window.activeTextEditor !== undefined ? ViewColumn.Beside : undefined
    if (TTSConsolePanel.currentPanel !== undefined) {
      // If the webview panel already exists reveal it
      TTSConsolePanel.currentPanel._panel.reveal(column)
      return
    }
    // If a webview panel does not already exist create and show a new one
    const panel = window.createWebviewPanel(
      // Panel view type
      L.TTSConsole.viewType() as string,
      // Panel title
      L.TTSConsole.title() as string,
      // The editor column the panel should be displayed in
      column ?? ViewColumn.One,
      // Extra panel configurations
      {
        // Enable JavaScript in the webview
        enableScripts: true,
        // Restrict the webview to only load resources from the `assets` directory
        localResourceRoots: [
          Uri.joinPath(TTSConsolePanel.extensionUri, 'node_modules', '@vscode/codicons', 'dist'),
          Uri.joinPath(TTSConsolePanel.extensionUri, 'assets')
          // Uri.joinPath(extensionUri, 'out')
        ]
      }
    )

    TTSConsolePanel.currentPanel = new TTSConsolePanel(panel)
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose (): void {
    TTSConsolePanel.currentPanel = undefined

    // Dispose of the current webview panel
    this._panel.dispose()

    // Dispose of all disposables (i.e. commands) associated with the current webview panel
    while (this._disposables.length > 0) {
      const disposable = this._disposables.pop()
      if (disposable !== undefined) disposable.dispose()
    }
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where *references* to CSS and JavaScript files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent (webview: Webview, extensionUri: Uri): string {
    const nonce = getNonce()

    // Load ./content.html as string, location is right next to this script
    const content = fsReadFileSync(Uri.joinPath(extensionUri, 'assets', 'web', 'content.html').fsPath, 'utf8')
    const placeholderValueMap: Record<string, any> = {
      // The following placeholders are used to replace the respective values in the content.html file
      // Replace the following placeholders with their respective values
      nonce,
      cspSource: webview.cspSource,
      fontFamily: getConfig<number>('console.fontFamily'),
      fontSize: getConfig<number>('console.fontSize'),
      inputHeight: getConfig<number>('console.inputHeight'),
      styleResetUri: webview.asWebviewUri(Uri.joinPath(extensionUri, 'assets', 'web', 'reset.css')),
      styleVSCodeUri: webview.asWebviewUri(Uri.joinPath(extensionUri, 'assets', 'web', 'vscode.css')),
      styleMainUri: webview.asWebviewUri(Uri.joinPath(extensionUri, 'assets', 'web', 'console.css')),
      codiconsUri: webview.asWebviewUri(Uri.joinPath(extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css')),
      scriptUri: webview.asWebviewUri(Uri.joinPath(extensionUri, 'assets', 'web', 'console.js')),
      clearOnFocus: getConfig<boolean>('console.clearOnFocus')
    }
    // Replace the following {{placeholders}} with their respective values
    const replacedContent = content.replace(
      /{{(\w+)}}/g,
      (match, key) => {
        if (placeholderValueMap[key] === undefined) {
          throw new Error(`Placeholder ${key} not found`)
        }
        return placeholderValueMap[key].toString()
      }
    )
    return replacedContent
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   */
  private _setWebviewMessageListener (webview: Webview): void {
    webview.onDidReceiveMessage(
      (message: { command: 'hello', text: string }) => {
        const command = message.command
        const text = message.text

        switch (command) {
          case 'hello':
            // Code that should run in response to the hello message command
            void window.showInformationMessage(text)

          // Add more switch case statements here as more webview message commands
          // are created within the webview context (i.e. inside src/webview/main.ts)
        }
      },
      undefined,
      this._disposables
    )
  }

  public async append (rawText: string, extras?: object): Promise<boolean> {
    return await this._panel.webview.postMessage({
      command: 'append',
      htmlString: BBCodeParse(rawText),
      ...(extras ?? {})
    })
  }
}
