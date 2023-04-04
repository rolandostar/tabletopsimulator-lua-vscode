import * as vscode from 'vscode'

import EditorApi from './CustomExternalEditorApi'
import listeners from './listeners'
import { prompts } from '@/vscode/windowManager'

export default class TTSService extends vscode.Disposable {
  public static api = new EditorApi()
  private static readonly _disposables: vscode.Disposable[] = []

  public static async start (): Promise<void> {
    // Register all listeners with corresponding callbacks, make sure we can dispose them later
    listeners.forEach(listener => {
      this._disposables.push(
        new vscode.Disposable(
          TTSService.api.on(listener.eventname, listener.callback)
        )
      )
    })
    // Start listening for incoming events
    await TTSService.api.listen()
  }

  public static async getScripts (): Promise<void> {
    if (!await prompts.getScriptsConfirmed()) return
    const { savePath } = await TTSService.api.getLuaScripts()
    console.log('[TTSLua] Save path:', savePath)
  }

  public static saveAndPlay (): void {
    console.log('[TTSLua] Save and Play')
  }

  public static dispose (): void {
    TTSService._disposables.forEach(d => d.dispose())
    TTSService.api.close()
    console.log('[TTSLua] Adapter resources disposed')
  }
}
