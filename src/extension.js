'use strict'

const vscode = require('vscode')
const TTSAdapter = require('./TTSAdapter')
const { tryCreateWorkspaceFolder, tryInstallConsole } = require('./filehandler')
const completion = require('./language/completion')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
/* -------------------------- Command Registration -------------------------- */
  // Open Panel
  context.subscriptions.push(
    vscode.commands.registerCommand('ttslua.openConsole', () => {
      adapter.createOrShowPanel()
    })
  )
  // Get Scripts
  context.subscriptions.push(
    vscode.commands.registerCommand('ttslua.getScripts', async () => {
      let option = await vscode.window.showQuickPick([
        {
          label: 'Get Scripts',
          description: '$(alert) This will erase any changes since the last Save & Play.'
        },
        { label: 'Cancel' }
      ], {
        placeHolder: 'Get Lua Scripts from game?'
      })
      if (option && option.label === 'Get Scripts') adapter.getScripts()

      // // Alternative confirmation dialog
      // const Choice = 'Get Scripts';
      // let chosen = await vscode.window.showInformationMessage(
      //   'Get Lua Scripts from game?\n\nThis will erase any changes that you have made in Visual Studio Code since the last Save & Play.',
      //   { modal: true },
      //   'Get Scripts'
      // )
      // if(chosen === 'Get Scripts') adapter.getScripts()
    })
  )
  // Save And Play
  context.subscriptions.push(
    vscode.commands.registerCommand('ttslua.saveAndPlay', () => {
      adapter.saveAndPlay()
    })
  )
  // Install Console ++
  context.subscriptions.push(
    vscode.commands.registerCommand('ttslua.installConsole', () => {
      tryInstallConsole(context.extensionPath)
      //
      // something
    })
  )

  /* -------------------------------------------------------------------------- */
  if (vscode.window.registerWebviewPanelSerializer) {
    vscode.window.registerWebviewPanelSerializer('TTSConsole', {
      async deserializeWebviewPanel (webviewPanel, state) {
        // `state` is the state persisted using `setState` inside the webview
        // console.log(`Got state: ${state}`)
        adapter.revivePanel(webviewPanel) // Restore the content of our webview.
      }
    })
  }
  /* ----------------------------- Initialization ----------------------------- */
  tryCreateWorkspaceFolder()
  completion.activate(context) // Activate autoCompletion
  let adapter = new TTSAdapter(context.extensionPath)
  console.debug('[TTSLua] Tabletop Simulator Extension Loaded')
}

function deactivate () { console.debug('Tabletop Simulator Extension Unloaded') }

module.exports = {
  activate,
  deactivate
}
