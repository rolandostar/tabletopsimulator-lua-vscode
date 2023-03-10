import * as vscode from 'vscode';

import EditorApi from './CustomExternalEditorApi';
import listeners from './listeners';
import {prompts} from '@/vscode/windowManager';

export default class TTSService extends vscode.Disposable {
  public static api = new EditorApi();
  private static _disposables: vscode.Disposable[] = [];

  public static start() {
    // Register all listeners with corresponding callbacks, make sure we can dispose them later
    listeners.forEach(listener => {
      this._disposables.push(
        new vscode.Disposable(
          TTSService.api.on(listener.eventname, listener.callback)
        )
      );
    });
    // Start listening for incoming events
    TTSService.api.listen();
  }

  public static async getScripts() {
    if (!await prompts.getScriptsConfirmed()) return;
    const { savePath } = await TTSService.api.getLuaScripts();
    console.log('[TTSLua] Save path:', savePath);
  }

  public static async saveAndPlay() {
    console.log('[TTSLua] Save and Play');
  }

  public static dispose() {
    TTSService._disposables.forEach(d => d.dispose());
    TTSService.api.close();
    console.log('[TTSLua] Adapter resources disposed');
  }
}
