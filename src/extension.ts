import * as vscode from 'vscode';
// TTS-Specific Imports
import TTSConsolePanel, {getWebviewOptions} from '@/TTSConsole';
import TTSAdapter from '@/TTSAdapter';
// Editor Imports
import * as workspace from '@/vscode/workspace';
import TTSLuaCompletionProvider from '@/vscode/LuaCompletionProvider';
import TTSXMLCompletionProvider from '@/vscode/XMLCompletionProvider';
import TTSHoverProvider from '@/vscode/HoverProvider';
import LocalStorageService from '@/vscode/LocalStorageService';
import TTSWorkDir from '@/vscode/TTSWorkDir';
import * as TTSAssetGen from '@/TTSAssetGen';

export async function activate(context: vscode.ExtensionContext) {
  console.log('[TTSLua] Tabletop Simulator Extension Load');
  // Set Storage Service to global context
  LocalStorageService.storage = context.globalState;

  const ttsWorkdir = new TTSWorkDir();
  const ttsAdapter = new TTSAdapter();
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
    {id: 'ttslua.openConsole', fn: () => TTSConsolePanel.createOrShow(context.extensionUri)},
    {id: 'ttslua.installConsole', fn: () => workspace.installConsole(context.extensionPath)},
    {id: 'ttslua.saveAndPlay', fn: () => ttsAdapter.saveAndPlay()},
    {
      id: 'ttslua.getScripts',
      fn: () =>
        vscode.window
          .showInformationMessage(
            'Get Lua Scripts from game?\n\n This will erase any changes that you have made since' +
              'the last Save & Play.',
            {modal: true},
            'Get Scripts'
          )
          .then((answer: 'Get Scripts' | undefined) => {
            if (answer === 'Get Scripts') ttsAdapter.getScripts();
          }),
    },
    {id: 'ttslua.executeLua', fn: () => ttsAdapter.executeLua()},
    {id: 'ttslua.changeWorkDir', fn: () => ttsWorkdir.changeWorkDir()},
    {id: 'ttslua.downloadAssets', fn: () => TTSAssetGen.downloadAssets()},
  ];

  context.subscriptions.push(
    // Register adapter disposables
    ttsAdapter,
    // Register all commands
    ...commands.map(cmd => vscode.commands.registerCommand(cmd.id, cmd.fn, context)),
    // Register providers for completion and hover
    vscode.languages.registerCompletionItemProvider(
      'lua',
      ttsLuaCompletionProvider,
      ...['.', ':', '(', ')', ' ']
    ),
    vscode.languages.registerCompletionItemProvider(
      'xml',
      ttsXMLCompletionProvider,
      ...['<', '/', ' ']
    ),
    vscode.languages.registerHoverProvider('lua', ttsHoverProvider)
  );

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
