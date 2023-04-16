/**
 * @file TTSService
 * This file is the entry point for the TTS Service. It is responsible for:
 * - Registering listeners which are event driven functions incoming from the game
 * - Exporting methods which can be called from the extension
 */

import { Disposable } from 'vscode'
import EditorApi from './CustomExternalEditorApi'
import listeners from './listeners'

import getScripts from './methods/getScripts'
import saveAndPlay from './methods/saveAndPlay'

type InGameObjectsList = Record<string, { name?: string, type?: string, iname?: string }>

const api = new EditorApi()
const disposables: Disposable[] = listeners.map(listener => {
  return new Disposable(api.on(listener.file, listener.content.default))
})

export function getEditorApi (): EditorApi { return api }

export async function start (): Promise<Disposable[]> {
  await api.listen()
  return disposables
}

export function getInGameObjects (): InGameObjectsList {
  return {}
}

export function executeLuaCode (script: string, guid: string): void {
}
export { getScripts, saveAndPlay }
