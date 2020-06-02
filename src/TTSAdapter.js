'use strict'

const { TTSLuaDir, docsFolder, FileHandler } = require('./filehandler')
const TTSParser = require('./bbcode/tabletop')
const vscode = require('vscode')
const path = require('path')
const net = require('net')
const fs = require('fs')

class TTSAdapter {
  constructor (extensionPath) {
    this._dir = vscode.Uri.file(TTSLuaDir)
    this._disposables = [] // Temporary Resources
    this._extensionPath = extensionPath
    this._ttsMsg = { // Poor man's enum
      pushObject: 0,
      NewGame: 1,
      Print: 2,
      Error: 3,
      Custom: 4,
      Return: 5,
      GameSaved: 6,
      ObjectCreated: 7
    }
    this._timeout = setTimeout(() => {
      this._savedAndPlayed = false
    }, 3000)
    this._initServer()
    this._executeWhenDone = function () {}
  }

  _initServer () {
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
      } else console.error('[TTSLua] Error: ' + err)
    })
    this._server.listen(39998) // Open Server
  }

  getScripts () {
    let vsFolders = vscode.workspace.workspaceFolders
    if (!vsFolders || vsFolders.findIndex(val => val.uri.fsPath === this._dir.fsPath) === -1) {
      vscode.workspace.updateWorkspaceFolders(0, vsFolders ? vsFolders.length : null, { uri: this._dir })
    }
    this._sendToTTS(0)
  }

  saveAndPlay () {
    let vsFolders = vscode.workspace.workspaceFolders
    if (!vsFolders || vsFolders.findIndex(val => val.uri.fsPath === this._dir.fsPath) === -1) {
      vscode.window.showErrorMessage('The workspace is not opened on the Tabletop Simulator folder.\nGet Lua Scripts from game before trying to Save and Play.')
      return
    }
    vscode.workspace.saveAll(false).then(async () => {
      let objects = new Map()
      try {
        fs.readdirSync(TTSLuaDir).forEach(file => {
          let filePath = path.join(TTSLuaDir, file)
          if (!fs.statSync(filePath).isDirectory()) {
            let tokens = file.split('.')
            let name = tokens[0]
            let guid = tokens[1]
            // If guid is not present in objects, create placeholder
            if (!objects.has(guid)) {
              objects.set(guid, { name, guid, script: '', ui: '' })
            }
            // Complete the object placeholder with the content of the file
            if (filePath.endsWith('.ttslua')) {
              let obj = objects.get(guid)
              // include system
              let luaScript = fs.readFileSync(filePath, 'utf8')
              obj.script = vscode.workspace.getConfiguration('TTSLua').get('includeOtherFiles')
                ? this._uncompressIncludes(luaScript, '', docsFolder)
                : luaScript
            } else if (filePath.endsWith('.xml')) {
              let obj = objects.get(guid)
              // let horizontalWhitespaceSet = '\\t\\v\\f\\r \u00a0\u2000-\u200b\u2028-\u2029\u3000'
              // let insertXmlFileRegexp = RegExp('(^|\\n)([' + horizontalWhitespaceSet + ']*)(.*)<Include\\s+src=(\'|")(.+)\\4\\s*/>', 'g')
              obj.ui = fs.readFileSync(filePath, 'utf8')
            }
          }
        })
      } catch (error) {
        vscode.window.showErrorMessage(error.message)
        return
      }
      // Hackish way to detect when panel is cleared.
      this._executeWhenDone = () => {
        this._sendToTTS(1, { scriptStates: [...objects.values()] })
        this._savedAndPlayed = true
        this._timeout.refresh()
      }
      if (vscode.workspace.getConfiguration('TTSLua').get('clearOnReload')) {
        this.clearPanel()
      } else {
        let f = this._executeWhenDone; f()
        this._executeWhenDone = function () {}
      }
    }, (_, _err) => {
      console.error('Unable to save all opened files')
    })
  }

  _uncompressIncludes (luaScript, baseFolder, includePath, alreadyInserted) {
    alreadyInserted = alreadyInserted || []
    let insertLuaFileRegexp = RegExp('^(\\s*%include\\s+([^\\s].*))', 'm')
    luaScript = luaScript.replace(/#include /g, '%include ')
    while (true) {
      let match = luaScript.match(insertLuaFileRegexp)
      if (match === null) break
      let includeFileName = match[2]
      let sharedFilePath
      let newBaseFolder
      let doBlock = includeFileName.startsWith('<') && includeFileName.endsWith('>')
      if (doBlock) {
        includeFileName = includeFileName.substr(1, includeFileName.length - 2)
      }
      if (includeFileName.startsWith('!')) {
        includeFileName = includeFileName.substr(1)
        sharedFilePath = includePath
        newBaseFolder = path.dirname(includeFileName)
      } else {
        sharedFilePath = path.join(includePath, baseFolder)
        newBaseFolder = path.dirname(path.join(baseFolder, includeFileName))
      }
      let sharedFullFile = path.join(sharedFilePath, includeFileName + '.ttslua')
      if (!alreadyInserted.includes(sharedFullFile)) {
        alreadyInserted.push(sharedFullFile)
        let sharedFileContents
        if (fs.existsSync(sharedFullFile) && fs.statSync(sharedFullFile).isFile()) {
          sharedFileContents = fs.readFileSync(sharedFullFile, 'utf8')
          sharedFileContents = this._uncompressIncludes(sharedFileContents, newBaseFolder, includePath, alreadyInserted)
        } else {
          throw new Error(`Include missing ${sharedFullFile} from ${includeFileName}`)
        }
        luaScript = [
          luaScript.slice(0, match.index),
          '---- #include ' + match[2] + '\n',
          doBlock ? 'do\n' : '',
          sharedFileContents,
          doBlock ? 'end\n' : '',
          '\n---- #include ' + match[2],
          luaScript.slice(match.index + match[0].length)
        ].join('')
      } else {
        throw new Error(`Circular include detected at ${includeFileName}.\n The file ${sharedFullFile} has been included previously.`)
      }
    }
    return luaScript
  }

  customMessage (object) {
    this._sendToTTS(2, { customMessage: object })
  }

  executeLuaCode (script, guid) {
    if (guid) this._sendToTTS(3, { guid, script })
    else this._sendToTTS(3, { guid: '-1', script })
  }

  _handleMessage (ttsMessage) {
    switch (ttsMessage.messageID) {
      case this._ttsMsg.pushObject:
        this.readFilesFromTTS(ttsMessage.scriptStates, true)
        break
      case this._ttsMsg.NewGame:
        if (this._savedAndPlayed) break
        this.readFilesFromTTS(ttsMessage.scriptStates)
        break
      case this._ttsMsg.Print:
        this.appendToPanel(TTSParser.parse(ttsMessage.message))
        break
      case this._ttsMsg.Error:
        this.appendToPanel(ttsMessage.errorMessagePrefix, { class: 'error' })
        break
      case this._ttsMsg.Custom: break // Can be used instead of print for console++
      case this._ttsMsg.Return: break // Not implemented
      case this._ttsMsg.GameSaved:
        if (vscode.workspace.getConfiguration('TTSLua').get('logSave')) {
          var today = new Date()
          this.appendToPanel('[' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + '] 💾 Game Saved')
        }
        break
      case this._ttsMsg.ObjectCreated: break // Not Implemented
    }
  }

  readFilesFromTTS (scriptStates, previewFlag) {
    previewFlag = previewFlag || false

    let toOpen = []
    let sentFromTTS = {}
    let autoOpen = vscode.workspace.getConfiguration('TTSLua').get('autoOpen')
    let createXml = vscode.workspace.getConfiguration('TTSLua').get('createXml')

    scriptStates.forEach(scriptState => {
      scriptState.name = scriptState.name.replace(/([":<>/\\|?*])/g, '')
      // XML Creation
      if (scriptState.ui || createXml) {
        let basename = `${scriptState.name}.${scriptState.guid}.xml`
        let handler = new FileHandler(basename)
        if (scriptState.ui) {
          handler.create(scriptState.ui.trim())
        } else handler.create('')
        if (autoOpen === 'All' || previewFlag) toOpen.push(handler)
        sentFromTTS[basename] = true
        // include system
        // let insertedXmlFileRegexp = RegExp('(<!--\\s+include\\s+([^\\s].*)\\s+-->)[\\s\\S]+?\\1', 'g')
      }
      // .ttslua Creation
      let basename = `${scriptState.name}.${scriptState.guid}.ttslua`
      let handler = new FileHandler(basename)
      handler.create(this._compressScripts(scriptState.script))
      if (autoOpen === 'All' || autoOpen === scriptState.name || previewFlag) { toOpen.push(handler) }
      sentFromTTS[basename] = true
    })
    // Remove files not received.
    if (!previewFlag) {
      fs.readdirSync(TTSLuaDir).forEach(file => {
        if (!(file in sentFromTTS)) {
          try { fs.unlinkSync(path.join(TTSLuaDir, file)) } catch (e) { console.error(e) }
        }
      })
    }
    let filesCount = Object.keys(sentFromTTS).length
    new Promise(async function () {
      for (let index = 0; index < toOpen.length; index++) {
        await toOpen[index].open()
      }
    }).then(() => {
      vscode.window.showInformationMessage(`Received ${filesCount} files`)
    })
  }

  _compressScripts (luaScript) {
    let match
    let storage = {}
    let insertedLuaFileRegexp = RegExp('^----(\\s*#include\\s+([^\\s].*))', 'mg')
    while ((match = insertedLuaFileRegexp.exec(luaScript)) !== null) {
      if (Object.keys(storage).length === 0) storage = { file: match[2], loc: match.index }
      else if (storage.file === match[2]) { // found pair
        luaScript = [
          luaScript.slice(0, storage.loc),
          '#include ' + match[2],
          luaScript.slice(match.index + match[2].length + 14)
        ].join('')
        storage = {}
      }
    }
    return luaScript
  }

  _sendToTTS (messageID, object) {
    let out = { messageID }
    if (object) out = { ...out, ...object }

    const client = net.connect(39999, 'localhost', function () {
      client.write(JSON.stringify(out))
    })
    client.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') {
        console.error('[TTSLua] Error: Unable to connect to TTS. Is the game open and a save loaded?\n' + err)
      } else console.error('[TTSLua] Client ' + err)
    })
    client.on('end', () => client.destroy())
  }

  createOrShowPanel () {
    const column = vscode.window.activeTextEditor
      ? vscode.ViewColumn.Active
      : undefined
    // If a panel exists, show it.
    if (this._webviewPanel) {
      this._webviewPanel.reveal(column)
      return
    }
    // Otherwise, create it
    const panel = vscode.window.createWebviewPanel(
      'TTSConsole',
      'Tabletop Simulator Console++',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true, // Enable javascript in the webview
        localResourceRoots: [
          vscode.Uri.file(path.join(this._extensionPath, 'assets', 'webView'))
        ],
        retainContextWhenHidden: true
      }
    )
    this._webviewPanel = this._webviewPanelInit(panel)
  }

  _webviewPanelInit (webviewPanel) {
    webviewPanel.webview.html = this._getHtmlForWebview() // Set webview content
    webviewPanel.onDidDispose(() => this.disposePanel(), null, this._disposables)
    webviewPanel.onDidChangeViewState(_e => {
      if (webviewPanel.visible) webviewPanel.webview.html = this._getHtmlForWebview()
    }, null, this._disposables)
    // Handle messages from the webview
    webviewPanel.webview.onDidReceiveMessage(message => {
      switch (message.type) {
        case 'command':
          this.customMessage({ command: message.text })
          break
        case 'input':
          this.customMessage({ input: message.text })
          break
        case 'done':
          let f = this._executeWhenDone; f()
          this._executeWhenDone = function () {}
          break
      }
    }, null, this._disposables)
    return webviewPanel
  }

  revivePanel (webviewPanel) {
    this._webviewPanel = this._webviewPanelInit(webviewPanel)
  }

  disposePanel () {
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
  appendToPanel (htmlString, optional) {
    if (this._webviewPanel) {
      let msg = { command: 'append', htmlString }
      if (optional) msg = { ...msg, ...optional }
      this._webviewPanel.webview.postMessage(msg)
    }
  }

  clearPanel () {
    if (this._webviewPanel) {
      this._webviewPanel.webview.postMessage({ command: 'clear' })
    }
  }

  _getHtmlForWebview () {
    const scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'assets', 'webView', 'js', 'console.js'))
    const stylePathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'assets', 'webView', 'css', 'console.css'))
    const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' })
    const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' })
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
            :root {
              --ttslua-console-font-family: ${vscode.workspace.getConfiguration('TTSLua').get('consoleFontFamily')};
              --ttslua-console-font-size: ${vscode.workspace.getConfiguration('TTSLua').get('consoleFontSize')};
              --ttslua-console-input-height: ${vscode.workspace.getConfiguration('TTSLua').get('consoleInputHeight')};
            }
            </style>
            <link rel="stylesheet" type="text/css" href="${styleUri}">
            <!--
            Here's a content security policy that allows loading local scripts and stylesheets, and loading images over https
            This content security policy also implicitly disables inline scripts and styles. It is a best practice to extract all inline styles and scripts to external files so that they can be properly loaded without relaxing the content security policy.
            -->
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src vscode-resource: https:; style-src vscode-resource: 'unsafe-inline'; font-src https:;"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
            <title>Tabletop Simulator Console++</title>
        </head>
        <body>
            <div id="commandInput">
              <input type="textbox" placeholder=">command"/>
            </div>
            <div id="data"></div>
            <script id="mainScript" type="module" src="${scriptUri}" clearOnFocus="${vscode.workspace.getConfiguration('TTSLua').get('clearOnFocus')}"></script>
        </body>
        </html>`
  }
}

module.exports = TTSAdapter
