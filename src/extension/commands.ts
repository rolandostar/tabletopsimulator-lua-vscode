/**
 * @file Command Manager
 * Commands are functions which are called when the user invokes a command.
 * They are registered in the `package.json` file.
 *
 * This file defines a command array which is used to register all commands.
 *
 * For commands being called within classes, make sure to wrap the function call
 * instead of passing the function itself, e.g. `() => { myInstance.myMethod() }`.
 * This ensures that the correct `this` context is used.
 */

import type * as vscode from 'vscode'
// import { getScripts, saveAndPlay } from '@/TTSService'
import { changeWorkDir } from '@/vscode/workspaceManager'
import getScripts from '@/TTSService/commands/getScripts'
import saveAndPlay from '@/TTSService/commands/saveAndPlay'
import { installConsole } from '@/vendor/installConsolePlusPlus'
import getExtensionUri from '@/utils/getExtensionUri'
import TTSConsolePanel from '@/TTSConsole'

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
  {
    id: 'ttslua.openConsole',
    fn: TTSConsolePanel.render.bind(TTSConsolePanel)
  },
  {
    id: 'ttslua.installConsole',
    fn: async () => {
      await installConsole(getExtensionUri().fsPath)
    }
  },
  { id: 'ttslua.saveAndPlay', fn: saveAndPlay },
  { id: 'ttslua.getScripts', fn: getScripts },
  // { id: 'ttslua.executeLua', fn: () => TTSAdapter.executeSelectedLua() },
  { id: 'ttslua.changeWorkDir', fn: changeWorkDir }
  // { id: 'ttslua.downloadAssets', fn: () => TTSAssetGen.downloadAssets() },
] as Array<{
  id: string
  fn: (this: vscode.ExtensionContext, ...args: any[]) => unknown
}>
