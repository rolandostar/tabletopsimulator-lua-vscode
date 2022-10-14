import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import TTSAdapter from '../TTSAdapter';

export default class TTSHoverProvider implements vscode.HoverProvider {
  provideHover(document: vscode.TextDocument, position: vscode.Position) {
    // Get hovered text
    const range = document.getWordRangeAtPosition(position);
    const text = document.getText(range);
    // check if hovered text is GUID format
    const igObjs = TTSAdapter.getInGameObjects();
    if (text in igObjs) {
      // If so, return a hover with the object name
      const obj = igObjs[text];
      const name = obj.name || obj.iname || '(No Name)';
      const script = fs
        .readFileSync(path.resolve(__dirname, '../lua/highlightVsCode.lua.template'), 'utf8')
        .replace('%guid%', text);
      TTSAdapter.executeSelectedLua(script, '-1');
      return new vscode.Hover(name);
    } else if (text.match(/[a-z0-9]{6}/)) return new vscode.Hover('No matching object found');
    return null;
  }
}
