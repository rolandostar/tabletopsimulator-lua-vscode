/**
 * @file API Manager
 * This file manages the API that is used for completion, stuff like downloading the latest API, and
 * loading it from local storage.
 */

import L from '@/i18n'
import * as LSS from '@/utils/LocalStorageService'
import fetch from 'node-fetch'
import { type FileSystemError } from 'vscode'
import { quickStatus } from '@/vscode/statusBarManager'
import { join } from 'path'
import FileManager from '@/vscode/fileManager'
import { compare } from 'compare-versions'

interface Basic {
  name: string
  type: string
  description?: string
}

interface Section extends Basic {
  description: string
  kind: string
  url: string
}

interface Parameter extends Basic {
  parameters?: Parameter[]
}

export interface Member extends Section {
  parameters?: Parameter[]
  return_table?: Parameter[]
  return_table_items?: Parameter[]
}

export interface LuaAPI {
  sections: Record<string, Section[]>
  version: string
  behaviors: string[]
}

const defaultDownloadedApiPath = 'completion/lua.json'

export async function loadApi (): Promise<LuaAPI> {
  try {
    // Attempt to load from local storage
    const localApi = await LSS.read(defaultDownloadedApiPath).then(async r => JSON.parse(r))
    quickStatus(`TTS Lua API Loaded from Local Storage: ${localApi.version}`)
    return localApi
  } catch (err) {
    if ((err as FileSystemError).code !== 'FileNotFound') throw err
    // If it doesn't exist, download it
    const remoteApi = await fetch(L.urls.luaCompletionApi())
      .then(async r => await r.json() as LuaAPI)
    // Check against shipped version
    const extPath = LSS.get<string>('extensionPath')
    if (extPath === undefined) throw new Error('Extension Path not found')
    const shippedApiFs = new FileManager(join(extPath, 'assets/apis/luaApi.json'), false)
    const shippedApi = JSON.parse(await shippedApiFs.read()) as LuaAPI
    if (compare(remoteApi.version, shippedApi.version, '>')) {
      await LSS.write(defaultDownloadedApiPath, JSON.stringify(remoteApi, undefined, 2))
      quickStatus(`TTS Lua API Updated to ${remoteApi.version}`)
      return remoteApi
    } else {
      await LSS.write(defaultDownloadedApiPath, JSON.stringify(shippedApi, undefined, 2))
      quickStatus(`TTS Lua API Loaded from Extension: ${shippedApi.version}`)
      return shippedApi
    }
  }
}
