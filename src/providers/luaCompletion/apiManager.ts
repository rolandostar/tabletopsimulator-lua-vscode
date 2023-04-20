/**
 * @file API Manager
 * This file manages the API that is used for completion, stuff like downloading the latest API, and
 * loading it from local storage.
 */

import L from '@/i18n'
import * as LSS from '@/utils/LocalStorageService'
import fetch from 'node-fetch'

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

export interface DownloadedAPI {
  sections: Record<string, Section[]>
  version: string
  behaviors: string[]
}

const defaultDownloadedApiPath = 'completion/luaApi.json'

export async function loadApi (): Promise<DownloadedAPI> {
  return await LSS.read(defaultDownloadedApiPath).then(async r => JSON.parse(r))
}

export async function downloadApi (): Promise<DownloadedAPI> {
  return await fetch(L.urls.luaCompletionApi()).then(async r => await r.json() as DownloadedAPI)
}
