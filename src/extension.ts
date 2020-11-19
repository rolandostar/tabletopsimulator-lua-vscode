import * as vscode from 'vscode';
import TTSAdapter from './TTSAdapter';
import activateCompletion from './language/completion';
import { createWorkspaceFolder, installConsole, addDocsFolderToWorkspace } from './filehandler';

export function activate(context: vscode.ExtensionContext) {
  /* ----------------------------- Initialization ----------------------------- */
  createWorkspaceFolder();
  activateCompletion(context);
  const adapter = new TTSAdapter(context.extensionPath);
  console.debug('[TTSLua] Tabletop Simulator Extension Loaded');
  /* ------------------------- Command Registration ------------------------- */
  // Add default include folder to workspace
  context.subscriptions.push(
    vscode.commands.registerCommand('ttslua.addDocsFolderToWorkspace', async () => {
      addDocsFolderToWorkspace();
    }),
  );
  // Open Panel
  context.subscriptions.push(
    vscode.commands.registerCommand('ttslua.openConsole', async () => {
      adapter.createOrShowPanel();
    }),
  );
  // Get Scripts
  context.subscriptions.push(
    vscode.commands.registerCommand('ttslua.getScripts', async () => {
      const chosen = await vscode.window.showInformationMessage(
        'Get Lua Scripts from game?\n\n'
        + 'This will erase any changes that you have made in'
        + ' Visual Studio Code since the last Save & Play.',
        { modal: true },
        'Get Scripts',
      );
      if (chosen === 'Get Scripts') adapter.getScripts();
      // // Alternative confirmation dialog
      // const option = await vscode.window.showQuickPick([
      //   {
      //     label: 'Get Scripts',
      //     description: '$(alert) This will erase any changes since the last Save & Play.',
      //   },
      //   { label: 'Cancel' },
      // ], {
      //   placeHolder: 'Get Lua Scripts from game?',
      // });
      // if (option && option.label === 'Get Scripts') adapter.getScripts();
    }),
  );
  // Save And Play
  context.subscriptions.push(
    vscode.commands.registerCommand('ttslua.saveAndPlay', () => {
      adapter.saveAndPlay();
    }),
  );
  // Install Console++
  context.subscriptions.push(
    vscode.commands.registerCommand('ttslua.installConsole', () => {
      installConsole(context.extensionPath);
    }),
  );

  /* -------------------------------------------------------------------------- */
  if (vscode.window.registerWebviewPanelSerializer) {
    vscode.window.registerWebviewPanelSerializer('TTSConsole', {
      async deserializeWebviewPanel(webviewPanel) {
        // `state` is the state persisted using `setState` inside the webview
        // console.log(`Got state: ${state}`)
        adapter.revivePanel(webviewPanel); // Restore the content of our webview.
      },
    });
  }
}

export function deactivate() { console.debug('Tabletop Simulator Extension Unloaded'); }
