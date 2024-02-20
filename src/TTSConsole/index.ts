import {
  type Disposable,
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
import TTSService from '@/TTSService'

export default class TTSConsolePanel {
  // TTS Console Panel is a singleton, so we keep track of the current panel
  public static currentPanel: TTSConsolePanel | undefined
  private static readonly extensionUri: Uri = getExtensionUri()
  private readonly _disposables: Disposable[] = []
  private commandMode = false

  // We read the content.html file at import time
  private readonly panelHTML = fsReadFileSync(Uri.joinPath(TTSConsolePanel.extensionUri, 'assets', 'web', 'content.html').fsPath, 'utf8')
  private readonly webviewUriFromExt = (...items: string[]): Uri =>
    this._panel.webview.asWebviewUri(Uri.joinPath(TTSConsolePanel.extensionUri, ...items))

  // We also generate the paths for the external resources at import time
  // The following map is used to replace the respective {{template}} in the content.html file
  private readonly templateValueMap: Record<string, any> = {
    nonce: getNonce(),
    cspSource: this._panel.webview.cspSource,
    fontFamily: getConfig<number>('console.fontFamily'),
    fontSize: getConfig<number>('console.fontSize'),
    styleResetUri: this.webviewUriFromExt('assets', 'web', 'reset.css'),
    styleVSCodeUri: this.webviewUriFromExt('assets', 'web', 'vscode.css'),
    styleMainUri: this.webviewUriFromExt('assets', 'web', 'console.css'),
    codiconsUri: this.webviewUriFromExt('node_modules', '@vscode/codicons', 'dist', 'codicon.css'),
    scriptUri: this.webviewUriFromExt('dist', 'webview.js'),
    clearOnFocus: getConfig<boolean>('console.clearOnFocus')
  }

  private constructor (private readonly _panel: WebviewPanel) {
    // Set an event listener to listen for when the webview panel is disposed
    this._panel.onDidDispose(() => { this.dispose() }, null, this._disposables)
    // Set the initial HTML content of the webview panel
    this._panel.webview.html = this._getWebviewContent()
    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener()
    // Command Mode is tracked in-game by Console++, we attempt to exit it when the webview is opened to keep them in sync
    void TTSService.getApi().customMessage({ command: 'exit' })
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   */
  public static render (): WebviewPanel {
    const column = window.activeTextEditor !== undefined ? ViewColumn.Beside : undefined
    if (TTSConsolePanel.currentPanel !== undefined) {
      // If the webview panel already exists reveal it
      TTSConsolePanel.currentPanel._panel.reveal(column)
      return TTSConsolePanel.currentPanel._panel
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
          Uri.joinPath(TTSConsolePanel.extensionUri, 'assets'),
          Uri.joinPath(TTSConsolePanel.extensionUri, 'dist')
        ]
      }
    )

    TTSConsolePanel.currentPanel = new TTSConsolePanel(panel)
    return TTSConsolePanel.currentPanel._panel
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose (): void {
    TTSConsolePanel.currentPanel = undefined
    this._panel.dispose()
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
   * @returns A string containing the HTML that should be
   * rendered within the webview panel
   */
  private readonly _getWebviewContent = (): string => this.panelHTML.replace(/{{(\w+)}}/g,
    (match, key) => {
      if (key in this.templateValueMap) return this.templateValueMap[key].toString()
      // TODO: Add a way to handle missing placeholders
      else throw new Error(`Placeholder "${key}" not found, during webview content replacement.`)
    }
  )

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   */
  private _setWebviewMessageListener (): void {
    this._panel.webview.onDidReceiveMessage((message: { type: 'command' | 'input', text: string }) => {
      if (message.type === 'command' || this.commandMode) {
        void TTSService.getApi().customMessage({ command: message.text })
      } else void TTSService.getApi().customMessage({ input: message.text })
      if (this.commandMode) {
        if (['>', 'exit'].includes(message.text)) this.commandMode = false
      } else if (['>', '>>', '>cmd'].includes(message.text)) this.commandMode = true
      void this._panel.webview.postMessage({ command: 'commandState', state: this.commandMode })
    },
    undefined,
    this._disposables
    )
  }

  public append = async (rawText: string, extras?: object): Promise<boolean> =>
    await this._panel.webview.postMessage({
      command: 'append',
      htmlString: BBCodeParse(rawText),
      ...(extras ?? {})
    })

  public isVisible = (): boolean => this._panel.visible

  public clear = async (): Promise<boolean> => await this._panel.webview.postMessage({ command: 'clear' })

  public static revive (panel: WebviewPanel, _state: unknown): void {
    TTSConsolePanel.currentPanel = new TTSConsolePanel(panel)
  }
}
