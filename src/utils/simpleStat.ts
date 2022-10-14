import * as vscode from 'vscode';

export async function uriExists(uri: vscode.Uri) {
  try {
    await vscode.workspace.fs.stat(uri);
  } catch (err) {
    if ((err as vscode.FileSystemError).code !== 'FileNotFound') {
      console.error(`Error Stating ${uri.fsPath}: ${err}`);
      throw err;
    } else return false;
  }
  return true;
}
