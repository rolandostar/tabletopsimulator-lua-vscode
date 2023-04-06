import { Disposable } from 'vscode'
import EditorApi from './CustomExternalEditorApi'
import listeners from './listeners'
import { prompts } from '@/vscode/windowManager'

type InGameObjectsList = Record<string, { name?: string, type?: string, iname?: string }>

export default class TTSService {
  private static instance: TTSService
  private readonly api = new EditorApi()
  private readonly _disposables: Disposable[] = []

  private constructor () {
    // Register all listeners with corresponding callbacks, make sure we can dispose them later
    listeners.forEach(listener => {
      this._disposables.push(
        new Disposable(this.api.on(listener.eventname, listener.callback))
      )
    })
  }

  public static getInstance (): TTSService {
    if (TTSService.instance === undefined) {
      TTSService.instance = new TTSService()
    }
    return TTSService.instance
  }

  public async start (): Promise<Disposable> {
    await this.api.listen()
    return new Disposable(this.dispose)
  }

  public async getScripts (): Promise<void> {
    if (!await prompts.getScriptsConfirmed()) return
    const { savePath } = await this.api.getLuaScripts()
    console.log('[TTSLua] Save path:', savePath)
  }

  public saveAndPlay (): void {
    console.log('[TTSLua] Save and Play')
  }

  public getInGameObjects (): InGameObjectsList {
    return {}
  }

  public executeLuaCode (script: string, guid: string): void {
  }

  private dispose (): void {
    this._disposables.forEach(d => d.dispose())
    this.api.close()
    console.log('[TTSLua] Adapter resources disposed')
  }
}
