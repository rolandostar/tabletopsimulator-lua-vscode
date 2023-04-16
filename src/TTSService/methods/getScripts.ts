import { FileManager } from '@/vscode/fileManager'
import getConfig from '@utils/getConfig'
import L from '@/i18n'
import bundler from 'luabundle'
import { NoBundleMetadataError } from 'luabundle/errors'
import { quickStatus } from '@/vscode/statusBarManager'
import { prompts } from '@/vscode/windowManager'
import { addWorkDir, isWorkdirDefault } from '@/vscode/workspaceManager'
import { type IncomingJsonObject } from '@matanlurey/tts-editor'
import { window } from 'vscode'
import { getEditorApi } from '..'

export default async function getScripts (): Promise<void> {
  if (!await prompts.getScriptsConfirmed()) return
  // Add folder to workspace (if not already there)
  const res = await getEditorApi().getLuaScripts()
  // If not in a git workdir, that's all we gotta do
  if (isWorkdirDefault()) {
    await addWorkDir()
    writeFiles(res.scriptStates)
  } else {
    console.log('Soemthing else that has to do with git repos')
  }
}

// Extend IncomingJsonObject to include an additional prop called, "json"
type IncomingGameObject = IncomingJsonObject & { json?: string }

function writeFiles (objects: IncomingGameObject[]): void {
  const statusBar = window.setStatusBarMessage('$(sync~spin) Receiving scripts')
  const autoOpen: string = getConfig('fileManagement.autoOpen')
  // Extract XML from objects
  for (const obj of objects) {
    obj.name = obj.name.replace(/([":<>/\\|?*])/g, '') // Remove illegal characters

    // XML File Creation
    // If the object received has UI Data or if user explicitly wants to create UI file for each.
    if (obj.ui != null || getConfig('fileManagement.createXML')) {
      const xmlMgr = new FileManager(`${obj.name}.${obj.guid}.xml`)
      // Replace <!-- include FILE --> with <Include src="FILE"/>
      void xmlMgr.write(
        obj.ui?.replace(
          /(<!--\s+include\s+([^\s].*)\s+-->)[\s\S]+?\1/g,
          (_matched, _open, src: string) => `<Include src="${src}"/>`
        ) ?? L.TTSService.XMLDefaultText()
      )
    }

    if (obj.json != null) {
      const jsonMgr = new FileManager(`${obj.name}.${obj.guid}.json`)
      void jsonMgr.write(obj.json)
    }

    // Lua File Creation
    const luaMgr = new FileManager(`${obj.name}.${obj.guid}.lua`)
    try {
      // Let's attempt to unbundle
      const data = bundler.unbundleString(obj.script)
      const { content } = data.modules[data.metadata.rootModuleName]
      // If unbundle was successful, write the file with the unbundled content
      if (content !== '') void luaMgr.write(content)
    } catch (err: unknown) {
      // Unbundle may fail if the script wasn't previously bundled, in that case, just write the script
      // If the failure is for any other reason, then throw it
      if (!(err instanceof NoBundleMetadataError)) {
        void window.showErrorMessage((err as Error).message)
        throw err
      }
      void luaMgr.write(obj.script)
      if (autoOpen === 'All') void luaMgr.open()
    }
  }
  if (autoOpen === 'Global') void (new FileManager('Global.-1.lua').open())
  statusBar.dispose()
  quickStatus(`$(cloud-download) Received ${objects.length} scripts from TTS`)
}
