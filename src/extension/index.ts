import * as vscode from 'vscode';
import TTSService from '../TTSService';
import commands from './commands';

export function activate(context: vscode.ExtensionContext) {
  console.log('[TTSLua] Tabletop Simulator Extension Load');
  TTSService.start();

  context.subscriptions.push(
    ...commands.map(cmd => vscode.commands.registerCommand(cmd.id, cmd.fn, context))
  );
}

export function deactivate() {}
