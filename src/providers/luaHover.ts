/**
 * @file Lua Hover Provider
 * This provider is used to provide hovers for lua files. It's currently only used to hightlight
 * objects in the game when hovering over their GUID.
 */

import * as fs from 'fs'
import * as vscode from 'vscode'
import TTSService from '@/TTSService'
import getExtensionUri from '@/utils/getExtensionUri'
import isGuidValid from '@/utils/isGuidValid'

const luaScript = fs.readFileSync(vscode.Uri.joinPath(getExtensionUri(), 'assets', 'lua', 'highlightVsCode.lua').fsPath, 'utf-8').toString()

export default class LuaHoverProvider implements vscode.HoverProvider {
  async provideHover (
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.Hover | null> {
    // Get hovered text
    const range = document.getWordRangeAtPosition(position)
    const hoveredText = document.getText(range)
    // check if hovered text is GUID format
    if (!isGuidValid(hoveredText)) return null
    await TTSService.getApi().executeLuaCode(luaScript.replace('{{guid}}', hoveredText), '-1')
    return new vscode.Hover('Highlighting object in game...')
  }
}
