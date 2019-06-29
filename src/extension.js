'use strict'

const vscode = require('vscode')

const TTSConsolePanel = require('./TTSConsolePanel')
const TTSServer = require('./server')

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
  var server = new TTSServer(TTSConsolePanel)
  TTSConsolePanel.server = server;
/* -------------------------- Command Registration -------------------------- */

// Open Panel
context.subscriptions.push(
  vscode.commands.registerCommand('ttslua.openConsole', () => {
    TTSConsolePanel.createOrShow(context.extensionPath)
  })
)

// Open Panel
context.subscriptions.push(
  vscode.commands.registerCommand('ttslua.getScripts', () => {
    //
  })
)

// Open Panel
context.subscriptions.push(
  vscode.commands.registerCommand('ttslua.saveAndPlay', () => {
    //
  })
)

/* ------------------------------- Serializers ------------------------------ */

  if (vscode.window.registerWebviewPanelSerializer) {
    // Make sure we register a serializer in activation event
    vscode.window.registerWebviewPanelSerializer(TTSConsolePanel.viewType, {
      async deserializeWebviewPanel(webviewPanel, state) {
          // `state` is the state persisted using `setState` inside the webview
          console.log(`Got state: ${state}`)
          // Restore the content of our webview.
          //
          // Make sure we hold on to the `webviewPanel` passed in here and
          // also restore any event listeners we need on it.
          TTSConsolePanel.revive(webviewPanel, context.extensionPath)
      }
    })
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
