import { FileManager } from '@/vscode/fileManager'
import getConfig from '@/utils/getConfig'
import L from '@/i18n'
import bundler from 'luabundle'
import { NoBundleMetadataError } from 'luabundle/errors'
import { quickStatus } from '@/vscode/statusBarManager'
import { prompts } from '@/vscode/windowManager'
import { addWorkDir, isWorkdirDefault } from '@/vscode/workspaceManager'
import { window } from 'vscode'
import { getEditorApi } from '..'
import { type GameObject } from '../CustomExternalEditorApi'
import prepareGameObjects from '../handlers/saveHandler'
import sanitizeFilename from '@/utils/sanitizeFilename'

export default async function getScripts (): Promise<void> {
  if (!await prompts.getScriptsConfirmed()) return
  // Add folder to workspace (if not already there)
  const res = await getEditorApi().getLuaScripts()
  // If not in a git workdir, that's all we gotta do
  if (isWorkdirDefault()) {
    await addWorkDir()
    await writeFiles(res.scriptStates)
  } else {
    console.log('Soemthing else that has to do with git repos')
    const saveMgr = new FileManager(res.savePath, false)
    // const savegame = JSON.parse(await saveMgr.read()) as SaveFile
    // const extracted = extractSave(savegame)
    const gameObjects = await prepareGameObjects(JSON.parse(await saveMgr.read()))
    await writeFiles(gameObjects)
    console.log('Done writing files')
  }
}

async function writeFiles (objects: GameObject[]): Promise<void> {
  const tsoOption = getConfig<boolean>('fileManagement.TSO.enabled')
  const statusBar = window.setStatusBarMessage('$(sync~spin) Receiving scripts')
  // TODO: Reenable this
  // const autoOpen: string = getConfig('fileManagement.autoOpen')
  // Extract XML from objects
  for (const obj of objects) {
    const objectContents: {
      lua?: string
      xml?: string
      yml?: string
    } = { yml: obj.objectProps }
    obj.name = sanitizeFilename(obj.name) // Remove illegal characters

    // If the object received has UI Data or if user explicitly wants to create UI file for each.
    if ((obj.ui !== undefined && obj.ui.length > 0) || getConfig('fileManagement.createXML')) {
      // Replace <!-- include FILE --> with <Include src="FILE"/>
      objectContents.xml = obj.ui?.replace(
        /(<!--\s+include\s+([^\s].*)\s+-->)[\s\S]+?\1/g,
        (_matched, _open, src: string) => `<Include src="${src}"/>`
      ) ?? L.TTSService.XMLDefaultText()
    }

    // Lua File Creation
    if (obj.script !== undefined && obj.script.length > 0) {
      try {
        // Let's attempt to unbundle
        const data = bundler.unbundleString(obj.script)
        const { content } = data.modules[data.metadata.rootModuleName]
        // If unbundle was successful, write the file with the unbundled content
        if (content !== '') objectContents.lua = content
      } catch (err: unknown) {
        // Unbundle may fail if the script wasn't previously bundled, in that case, just write the script
        // If the failure is for any other reason, then throw it
        if (!(err instanceof NoBundleMetadataError)) {
          void window.showErrorMessage((err as Error).message)
          throw err
        }
        objectContents.lua = obj.script
      }
    }
    // Done calculating object contents, now write them to disk
    const basename = `${obj.location ?? ''}${obj.name}.${obj.guid}`
    if (tsoOption) {
      let tsoContent = ''
      const tsoMgr = new FileManager(basename + '.tso')
      if (objectContents.lua !== undefined) tsoContent += `\`\`\`script\n${objectContents.lua}\n\`\`\`\n\n`
      if (objectContents.xml !== undefined) tsoContent += `\`\`\`ui\n${objectContents.xml}\n\`\`\`\n\n`
      if (objectContents.yml !== undefined) tsoContent += `\`\`\`object\n${objectContents.yml}\`\`\`\n`
      await tsoMgr.write(tsoContent)
    } else {
      // This is just fancy Typescript to iterate over objectContents while keeping types
      type keyType = keyof typeof objectContents
      Array.from(Object.keys(objectContents) as keyType[]).forEach((ext) => {
        const mgr = new FileManager(basename + '.' + ext)
        // Get content, write if found
        const content = objectContents[ext]
        if (content !== undefined) void mgr.write(content)
      })
    }
  }
  // if (autoOpen === 'Global') void (new FileManager('Global.-1.lua').open())
  statusBar.dispose()
  quickStatus(`$(cloud-download) Received ${objects.length} scripts from TTS`)
}
