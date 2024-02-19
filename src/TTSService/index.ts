/**
 * @file TTSService
 * This file is the entry point for the TTS Service. It is responsible for:
 * - Registering listeners which are event driven functions incoming from the game
 * The class is a Singleton, so no matter where it is imported, it will always be the same instance.
 */

import { Disposable } from 'vscode'
import EditorApi from './CustomExternalEditorApi'
import listeners from './eventManager'

export default class TTSService {
  // Singleton Pattern
  private static instance: TTSService
  // Guardrail to prevent disposables mismanagement
  private ready: boolean = false
  // API to communicate with the game
  private readonly api: EditorApi
  // Listeners to be disposed when the service is closed
  private readonly disposables: Disposable[]

  // Register listeners and create the API
  private constructor () {
    this.api = new EditorApi()
    this.disposables = listeners.map(l => new Disposable(this.api.on(l.eventName, l.handler)))
  }

  // Singleton Pattern and Guardrail
  public static getInstance (): TTSService {
    if (TTSService.instance === undefined) TTSService.instance = new TTSService()
    else if (!TTSService.instance.ready) throw new Error('TTSService is not ready yet')
    return TTSService.instance
  }

  // Open the service and return the disposables
  public async open (): Promise<Disposable[]> {
    await this.api.listen()
    this.ready = true
    return this.disposables
  }

  public static getApi (): EditorApi {
    return TTSService.getInstance().api
  }
}
