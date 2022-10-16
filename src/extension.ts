import * as vscode from 'vscode';
// TTS-Specific Imports
import TTSConsolePanel, { getWebviewOptions } from './TTSConsole';
// Editor Imports
import TTSAdapter from './TTSAdapter';
import * as TTSAssetGen from './TTSAssetGen';
import TTSWorkDir from './TTSWorkDir';
import TTSHoverProvider from './vscode/HoverProvider';
import LocalStorageService from './vscode/LocalStorageService';
import TTSLuaCompletionProvider from './vscode/LuaCompletionProvider';
import * as workspace from './vscode/workspace';
import TTSXMLCompletionProvider from './vscode/XMLCompletionProvider';

export async function activate(context: vscode.ExtensionContext) {
  // Set context as a global as some tests depend on it
  (global as any).testExtensionContext = context;

  console.log('[TTSLua] Tabletop Simulator Extension Load');
  // Set Storage Service to global context
  LocalStorageService.storage = context.globalState;

  TTSWorkDir.init();
  TTSAdapter.registerListeners();

  const ttsHoverProvider = new TTSHoverProvider();
  const ttsLuaCompletionProvider = new TTSLuaCompletionProvider();
  const ttsXMLCompletionProvider = new TTSXMLCompletionProvider();
  const commands: {
    id: string;
    fn: (this: vscode.ExtensionContext, ...args: any[]) => unknown;
  }[] = [
    {
      id: 'ttslua.forceAutocompleteUpdate',
      fn: () => ttsLuaCompletionProvider.updateCompletionItems(true),
    },
    {
      id: 'ttslua.updateCompletionItems',
      fn: () => ttsLuaCompletionProvider.updateCompletionItems(),
    },
    {
      id: 'ttslua.addGlobalInclude',
      fn: () => workspace.addDir2WS(workspace.docsFolder, 'TTS Global Include'),
    },
    {
      id: 'ttslua.openConsole',
      fn: () => TTSConsolePanel.createOrShow(context.extensionUri),
    },
    {
      id: 'ttslua.installConsole',
      fn: () => workspace.installConsole(context.extensionPath),
    },
    { id: 'ttslua.saveAndPlay', fn: () => TTSAdapter.saveAndPlay() },
    {
      id: 'ttslua.getScripts',
      fn: () =>
        vscode.window
          .showInformationMessage(
            'Get Lua Scripts from game?\n\n This will erase any changes that you have made since' +
              'the last Save & Play.',
            { modal: true },
            'Get Scripts',
          )
          .then((answer: 'Get Scripts' | undefined) => {
            if (answer === 'Get Scripts') TTSAdapter.getScripts();
          }),
    },
    { id: 'ttslua.executeLua', fn: () => TTSAdapter.executeSelectedLua() },
    { id: 'ttslua.changeWorkDir', fn: () => TTSWorkDir.changeWorkDir() },
    { id: 'ttslua.downloadAssets', fn: () => TTSAssetGen.expander() },
  ];

  context.subscriptions.push(
    // Register adapter disposables
    new vscode.Disposable(TTSAdapter.dispose),
    // Register all commands
    ...commands.map(cmd => vscode.commands.registerCommand(cmd.id, cmd.fn, context)),
    // Register providers for completion and hover
    vscode.languages.registerHoverProvider('lua', ttsHoverProvider),
  );

  // Get config and register providers accordingly
  const autocompletion = vscode.workspace.getConfiguration('ttslua.autocompletion');
  if (autocompletion.get('luaEnabled')) {
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        'lua',
        ttsLuaCompletionProvider,
        ...['.', ':', '(', ')', ' '],
      ),
    );
  }
  if (autocompletion.get('xmlEnabled')) {
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        'xml',
        ttsXMLCompletionProvider,
        ...['<', '/', ' '],
      ),
    );
  }

  // Register the TTS Console Panel
  if (vscode.window.registerWebviewPanelSerializer) {
    // Make sure we register a serializer in activation event
    vscode.window.registerWebviewPanelSerializer(TTSConsolePanel.viewType, {
      // Omit State
      async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel) {
        // console.log(`Got state: ${state}`);
        // Reset the webview options so we use latest uri for `localResourceRoots`.
        webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
        TTSConsolePanel.revive(webviewPanel, context.extensionUri);
      },
    });
  }
}
