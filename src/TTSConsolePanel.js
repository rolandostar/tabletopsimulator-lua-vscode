const vscode = require('vscode')
const path = require('path')
const net = require('net')

module.exports = class TTSConsolePanel {
  constructor(panel, extensionPath) {
    this._disposables = [] // Temporary Resources
    this._panel = panel; // Current Panel
    this._extensionPath = extensionPath

    // Set the webview initial html content
    this._update()

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables)

    // Update the content based on view changes
    this._panel.onDidChangeViewState(e => {
      if (this._panel.visible) this._update()
    }, null, this._disposables)

    // TODO: Implement logic for receiving messages from the webview
    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(message => {
      switch (message.command) {
          case 'customMessage':
              console.log('connecting')
              const client = net.connect(39999, 'localhost', function() {
                client.write(JSON.stringify({
                  messageID: 2,
                  customMessage: {
                    text: message.text
                  }
                }), 'UTF-8', () => console.log('finished writing'))
              })
              client.on('end', () => {
                console.log('client destroy')
                client.destroy()
              })
              break
      }
    }, null, this._disposables);
  }

  static createOrShow(extensionPath) {
    const column = vscode.window.activeTextEditor
            ? vscode.ViewColumn.Beside
            : undefined
    // If a panel exists, show it.
    if (TTSConsolePanel.currentPanel){
      TTSConsolePanel.currentPanel._panel.reveal(column)
      return
    }
    // Otherwise, create it
    const panel = vscode.window.createWebviewPanel('TTSConsole', "Tabletop Simulator Console++", column || vscode.ViewColumn.One, {
      enableScripts: true, // Enable javascript in the webview
      localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'assets'))],
      retainContextWhenHidden: true
    })
    TTSConsolePanel.currentPanel = new TTSConsolePanel(panel, extensionPath)
  }

  static revive(panel, extensionPath) {
    TTSConsolePanel.currentPanel = new TTSConsolePanel(panel, extensionPath)
  }

  dispose() {
    TTSConsolePanel.currentPanel = undefined

    // Clean up our resources
    this._panel.dispose()

    while (this._disposables.length) {
        const x = this._disposables.pop()
        if (x) {
            x.dispose()
        }
    }
  }

  _update() {
    this._panel.webview.html = this.getHtmlForWebview()
    return
  }

  append(htmlString) {
    // Send a message to the webview webview.
    // You can send any JSON serializable data.
    this._panel.webview.postMessage(htmlString);
  }

  getHtmlForWebview() {
    // Local path to main script run in the webview
    const scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'assets', 'js', 'console.js'))
    const stylePathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'assets', 'css', 'console.css'))
    // And the uri we use to load this script in the webview
    const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' })
    const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' })
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <link rel="stylesheet" type="text/css" href="${styleUri}">
            <!--
            Here's a content security policy that allows loading local scripts and stylesheets, and loading images over https
            This content security policy also implicitly disables inline scripts and styles. It is a best practice to extract all inline styles and scripts to external files so that they can be properly loaded without relaxing the content security policy.
            -->
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src vscode-resource: https:; style-src vscode-resource: 'unsafe-inline';"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
            <title>Tabletop Simulator Console++</title>
        </head>
        <body>
            <div id="commandInput">
              <input type="textbox" value=">"/>
            </div>
            <div id="data"></div>
            <script type="module" src="${scriptUri}"></script>
        </body>
        </html>`
  }
}
