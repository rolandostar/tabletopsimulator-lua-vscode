import * as vscode from 'vscode';

export function quickStatus(message: string) {
  const statusBar = vscode.window.setStatusBarMessage(message);
  setTimeout(() => statusBar.dispose(), 1500);
}
