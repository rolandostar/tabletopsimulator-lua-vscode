'use strict'

const { TTSLuaDir, FileHandler } = require('./filehandler')
const { tryCreateWorkspaceFolder } = require('./filehandler')
const TTSParser = require('./bbcode/tabletop')
const vscode = require('vscode')
const path = require('path')
const net = require('net')
const fs = require('fs')

class TTSAdapter {
  constructor(extensionPath) {
    this._dir = vscode.Uri.file(TTSLuaDir);
    this._disposables = [] // Temporary Resources
    this._extensionPath = extensionPath
    this._ttsMsg = { // Poor man's enum
      pushObject:    0,
      NewGame:       1,
      Print:         2,
      Error:         3,
      Custom:        4,
      Return:        5,
      GameSaved:     6,
      ObjectCreated: 7
    }
    // Initialize Server for incoming TTS Messages
    this._server = net.createServer((socket) => {
      const chunks = []
      // Set timeout in case of unexpected connection drop
      socket.setTimeout(10000)
      socket.on('timeout', () => socket.end())
      socket.on('end', () => {
        const input = Buffer.concat(chunks)
        this._handleMessage(JSON.parse(input.toString()))
        socket.end()
      }) // Normal disconnect after data read
      socket.on('data', chunk => chunks.push(chunk))
    })
    this._server.on('listening', () => console.debug('[TTSLua] Server open.'))
    this._server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error('[TTSLua] Port 39998 is in use, retrying...')
        setTimeout(() => {
          this._server.close()
          this._server.listen(39998)
        }, 1000)
      } else console.error("[TTSLua] Error: " + err)
    })
    this._server.listen(39998) // Open Server
  }

  getScripts() {
    let vsFolders = vscode.workspace.workspaceFolders
    if(!vsFolders || vsFolders.findIndex(val => val.uri.fsPath === this._dir.fsPath) === -1) {
      vscode.workspace.updateWorkspaceFolders(0, vsFolders ? vsFolders.length : null, { uri: this._dir })
    }
    this._sendToTTS(0)
  }

  saveAndPlay() {
    let vsFolders = vscode.workspace.workspaceFolders
    if(!vsFolders || vsFolders.findIndex(val => val.uri.fsPath === this._dir.fsPath) === -1) {
      vscode.window.showErrorMessage('The workspace is not opened on the Tabletop Simulator folder.\nGet Lua Scripts from game before trying to Save and Play.')
      return
    }
    vscode.workspace.saveAll(false).then(() => {
      let objects = new Map();
      fs.readdirSync(TTSLuaDir).forEach(file => {
        let filePath = path.join(TTSLuaDir, file);
        if(!fs.statSync(filePath).isDirectory()) {
            let tokens = file.split(".")
            let name = tokens[0]
            // If guid is not present in objects, create placeholder
            if(!objects.has(name)) {
                objects.set(name, { name, guid: tokens[1], script: '', ui: '' })
            }
            // Complete the object placeholder with the content of the file
            if(filePath.endsWith('.ttslua')) {
                let obj = objects.get(name);
                obj.script = fs.readFileSync(filePath, 'utf8');
            // included files...
            } else if(filePath.endsWith('.xml')) {
                let obj = objects.get(name);
                obj.ui = fs.readFileSync(filePath, 'utf8');
            }
        }
      })
      this._sendToTTS(1, { scriptStates: [...objects.values()] })
    }, (undefined, err) => {
      console.error('Unable to save all opened files');
      return;
    })
  }

  customMessage(messageObj) {
    this._sendToTTS(2, messageObj)
  }

  executeLuaCode(script, guid) {
    if(guid) this._sendToTTS(3, { guid, script })
    else this._sendToTTS(3, { guid: '-1', script })
  }

  _handleMessage(ttsMessage) {
    switch(ttsMessage.messageID) {
      case this._ttsMsg.pushObject:
        this.readFilesFromTTS(ttsMessage.scriptStates, true)
        break
      case this._ttsMsg.NewGame:
        this.readFilesFromTTS(ttsMessage.scriptStates)
        break
      case this._ttsMsg.Print:
          if (this._webviewPanel){
            this.appendToPanel(TTSParser.parse(ttsMessage.message))
          }
        break
      case this._ttsMsg.Error:
          if(this._webviewPanel){
            this.appendToPanel(ttsMessage.errorMessagePrefix, { class: 'error' })
          }
        break
      case this._ttsMsg.Custom:
        break
      case this._ttsMsg.Return:
        break
      case this._ttsMsg.GameSaved:
        break
      case this._ttsMsg.ObjectCreated:
        break
    }
  }

  readFilesFromTTS(scriptStates, previewFlag) {
    previewFlag = previewFlag || false

    let toOpen = []
    let sentFromTTS = {}
    let autoOpen = vscode.workspace.getConfiguration('TTSLua').get('autoOpen')
    let createXml = vscode.workspace.getConfiguration('TTSLua').get('createXml')

    scriptStates.forEach(scriptState => {
      scriptState.name = scriptState.name.replace(/([":<>/\\|?*])/g, '')
      // XML Creation
      if(scriptState.ui || createXml) {
        let basename = `${scriptState.name}.${scriptState.guid}.xml`
        let handler = new FileHandler(basename);
        if(scriptState.ui) {
          handler.create(scriptState.ui.trim())
        } else handler.create('')
        if(autoOpen === 'All' || previewFlag) toOpen.push(handler)
        sentFromTTS[basename] = true
      }
      // .ttslua Creation
      let basename = `${scriptState.name}.${scriptState.guid}.ttslua`
      let handler = new FileHandler(basename)
      handler.create(scriptState.script)
      if(autoOpen === 'All' || autoOpen === scriptState.name || previewFlag)
      toOpen.push(handler)
      sentFromTTS[basename] = true
    })
    // Remove files not received.
    if (!previewFlag) {
      fs.readdirSync(TTSLuaDir).forEach(file => {
        if(!(file in sentFromTTS)) {
          try { fs.unlinkSync(path.join(TTSLuaDir, file)) }
          catch(e) { console.error(e) }
        }
      })
    }
    let filesCount = Object.keys(sentFromTTS).length;
    Promise.all(toOpen.map(f => f.open())).then(() => {
      vscode.window.showInformationMessage(`Received ${filesCount} files`)
    })
  }

  _sendToTTS(messageID, object) {
    let out = { messageID }
    if (object) out = {...out, ...object}

    const client = net.connect(39999, 'localhost', function() {
      client.write(JSON.stringify(out))
    })
    client.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') {
        console.error('[TTSLua] Error: Unable to connect to TTS. Is the game open and a save loaded?\n' + err)
      } else console.error("[TTSLua] Error: " + err)
    })
    client.on('end', () => client.destroy())
  }

  createOrShowPanel() {
    const column = vscode.window.activeTextEditor
            ? vscode.ViewColumn.Active
            : undefined
    // If a panel exists, show it.
    if (this._webviewPanel){
      this._webviewPanel.reveal(column)
      return
    }
    // Otherwise, create it
    const panel = vscode.window.createWebviewPanel(
      'TTSConsole',
      "Tabletop Simulator Console++",
      column || vscode.ViewColumn.One,
      {
        enableScripts: true, // Enable javascript in the webview
        localResourceRoots: [
          vscode.Uri.file(path.join(this._extensionPath, 'assets'))
        ],
        retainContextWhenHidden: true
      }
    )
    this._webviewPanel = this._webviewPanelInit(panel)
  }

  _webviewPanelInit(webviewPanel){
    webviewPanel.webview.html = this._getHtmlForWebview() // Set webview content
    webviewPanel.onDidDispose(()=>this.disposePanel(), null, this._disposables)
    webviewPanel.onDidChangeViewState(e => {
      if (webviewPanel.visible) webviewPanel.webview.html = this._getHtmlForWebview()
    }, null, this._disposables)
    // Handle messages from the webview
    webviewPanel.webview.onDidReceiveMessage(message => {
      switch (message.command) {
          case 'customMessage':
              this.customMessage({ text: message.text })
            break
      }
    }, null, this._disposables);
    return webviewPanel
  }

  revivePanel(webviewPanel) {
    this._webviewPanel = this._webviewPanelInit(webviewPanel)
  }

  disposePanel() {
    // Clean up our resources
    this._webviewPanel.dispose()
    this._webviewPanel = undefined

    while (this._disposables.length) {
        const x = this._disposables.pop()
        if (x) {
            x.dispose()
        }
    }
  }

  // Send a message to the webview webview.
  // Assumes panel is initialized
  appendToPanel(htmlString, optional) {
    let msg = { htmlString }
    if (optional) msg = {...msg, ...optional}
    this._webviewPanel.webview.postMessage(msg);
  }

  _getHtmlForWebview() {
    const scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'assets', 'js', 'console.js'))
    const stylePathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'assets', 'css', 'console.css'))
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

module.exports = TTSAdapter
