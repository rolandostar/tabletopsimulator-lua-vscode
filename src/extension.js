'use strict'
const vscode = require('vscode')

const TTSConsolePanel = require('./TTSConsolePanel')
TTSConsolePanel.viewType = 'TTSConsole';

const net = require('net')
const { TTSLuaDir } = require('./filehandler')
const completion = require('./language/completion')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
/* ----------------------------- Initialization ----------------------------- */
  console.log('Tabletop Simulator Extension Loaded')
  completion.activate(context)
  console.log('Directory: ' + TTSLuaDir)

/* ---------------------------- Server Behaviour ---------------------------- */

  const server = net.createServer((socket) => {
    console.log('client connected')
    socket.setTimeout(10000)
    socket.on('timeout', () => socket.end())
    socket.on('end', () => {
      console.log('client disconnected')
      socket.end()
    })
    socket.on('close', () => {
      console.log('client close')
    })
    socket.on('data', (input) => {
      console.log(`Read ${input.length} bytes`)
      var obj = JSON.parse(input.toString())
      if (TTSConsolePanel.currentPanel) { // If panel available
        TTSConsolePanel.currentPanel.send({ command: 'append', text: input.toString() })
      }
      // switch (obj.messageID) {
      //   case 0:
      //     console.log('0')
      //     break
      //   case 1:
      //     console.log('1')
      //     break
      //   default:
      //     console.log('default')
      //     break
      // }
    })
  })
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log('Address in use, retrying...')
      setTimeout(() => {
        server.close()
        server.listen(39998, console.log('server bound'))
      }, 1000)
    }
  })
  server.listen(39998, console.log('server bound'))

/* -------------------------- Command Registration -------------------------- */

// Open Panel
context.subscriptions.push(
  vscode.commands.registerCommand('ttslua.openConsole', () => {
    TTSConsolePanel.createOrShow(context.extensionPath)
  })
)

// [TEST] Send messages to webview
context.subscriptions.push(
  vscode.commands.registerCommand('ttslua.debugMsgSend', () => {
      for (var i = 0; i < 1000; i++) {
        (function(i) {
          setTimeout(function() {
            // You can send any JSON serializable data.
            if (TTSConsolePanel.currentPanel) { // If panel available
              TTSConsolePanel.currentPanel.send({ command: 'append', text: 'error or something'+i })
            } else {
              // no panel available TODO: Notify
              vscode.window.showInformationMessage('No available panel')
              return
            }
          }, 100 * i)
        })(i)
      }
  })
)

/* ------------------------------- Serializers ------------------------------ */

  if (vscode.window.registerWebviewPanelSerializer) {
    // Make sure we register a serializer in activation event
    vscode.window.registerWebviewPanelSerializer(TTSConsolePanel.viewType, {
      async deserializeWebviewPanel(webviewPanel, state) {
          // `state` is the state persisted using `setState` inside the webview
          console.log(`Got state: ${state}`);
          // Restore the content of our webview.
          //
          // Make sure we hold on to the `webviewPanel` passed in here and
          // also restore any event listeners we need on it.
          TTSConsolePanel.revive(webviewPanel, context.extensionPath);
      }
    });
  }
}

// this method is called when your extension is deactivated
function deactivate () {
  console.log('Tabletop Simulator Extension Unloaded')
}

module.exports = {
  activate,
  deactivate
}
