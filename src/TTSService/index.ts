/**
 * @file TTSService
 * This file is the entry point for the TTS Service. It is responsible for:
 * - Registering listeners which are event driven functions incoming from the game
 * The class is a Singleton, so no matter where it is imported, it will always be the same instance.
 */

import { Disposable } from 'vscode'
import EditorApi from './CustomExternalEditorApi'
import listeners from './listeners'

export default class TTSService {
  private static instance: TTSService
  private ready: boolean = false
  public readonly api: EditorApi
  private readonly disposables: Disposable[]

  private constructor () {
    this.api = new EditorApi()
    this.disposables = listeners.map(listener => {
      return new Disposable(this.api.on(listener.file, listener.content.default))
    })
  }

  public static getInstance (): TTSService {
    if (TTSService.instance === undefined) TTSService.instance = new TTSService()
    else if (!TTSService.instance.ready) throw new Error('TTSService is not ready yet')
    return TTSService.instance
  }

  public async init (): Promise<Disposable[]> {
    await this.api.listen()
    this.ready = true
    return this.disposables
  }

  public static getApi (): EditorApi {
    return TTSService.getInstance().api
  }
}
