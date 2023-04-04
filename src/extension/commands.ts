import type * as vscode from 'vscode'
// import ttsLuaCompletionProvider from '@/providers/luaCompletion'
import TTSService from '@/TTSService'

export default [
  // {
  //   id: 'ttslua.forceAutocompleteUpdate',
  //   fn: () => ttsLuaCompletionProvider.updateCompletionItems(true),
  // },
  // {
  //   id: 'ttslua.updateCompletionItems',
  //   fn: () => ttsLuaCompletionProvider.updateCompletionItems(),
  // },
  // {
  //   id: 'ttslua.addGlobalInclude',
  //   fn: () => workspace.addDir2WS(workspace.docsFolder, 'TTS Global Include'),
  // },
  // {
  //   id: 'ttslua.openConsole',
  //   fn: () => TTSConsolePanel.createOrShow(context.extensionUri),
  // },
  // {
  //   id: 'ttslua.installConsole',
  //   fn: () => workspace.installConsole(context.extensionPath),
  // },
  { id: 'ttslua.saveAndPlay', fn: async () => { await TTSService.saveAndPlay() } },
  { id: 'ttslua.getScripts', fn: async () => { await TTSService.getScripts() } }
  // { id: 'ttslua.executeLua', fn: () => TTSAdapter.executeSelectedLua() },
  // { id: 'ttslua.changeWorkDir', fn: () => TTSWorkDir.changeWorkDir() },
  // { id: 'ttslua.downloadAssets', fn: () => TTSAssetGen.downloadAssets() },
] as Array<{
  id: string
  fn: (this: vscode.ExtensionContext, ...args: any[]) => unknown
}>
