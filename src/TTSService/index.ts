import { Disposable } from 'vscode'
import EditorApi from './CustomExternalEditorApi'
import listeners from './listeners'

import getScripts from './methods/getScripts'

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

export function saveAndPlay (): void {
  console.log('[TTSLua] Save and Play')
}

export function getInGameObjects (): InGameObjectsList {
  return {}
}

export function executeLuaCode (script: string, guid: string): void {
}
export { getScripts }
