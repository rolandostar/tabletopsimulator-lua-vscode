import { window } from 'vscode'
import { FileManager } from '@/vscode/fileManager'
import { quickStatus } from '@/vscode/statusBarManager'
import { prompts } from '@/vscode/windowManager'
import { addDefaultWorkDir, getWorkDir, isWorkdirDefault } from '@/vscode/workspaceManager'
import TTSService from '@/TTSService'
import getConfig from '@/utils/getConfig'
import { extractSave, readSave } from '@tts-tools/savefile'
import FileTree from '@/utils/saveFileToFileTree'
import L from '@/i18n'

export default async function getScripts (): Promise<void> {
  if (!await prompts.getScriptsConfirmed()) return
  const statusBar = window.setStatusBarMessage('$(sync~spin) Receiving scripts')
  const gameResponse = await TTSService.getApi().getLuaScripts()

  // Add folder to workspace (Only if default workspace is used, since non-default workspaces are added by the user)
  if (isWorkdirDefault()) await addDefaultWorkDir()

  // Perform the extraction
  const saveFile = readSave(gameResponse.savePath)

  extractSave(saveFile, { output: getWorkDir().fsPath, withState: true, scriptExtension: 'lua' })

  // With the scripts extracted, we can now open them in the editor
  const openConfig = getConfig<autoOpen>('fileManagement.autoOpen')
  if (openConfig !== 'None') {
    void new FileManager('Script.lua').show()
    if (openConfig === 'All') {
      for (const path of new FileTree(saveFile).getScriptPaths()) {
        void new FileManager(path).show()
      }
    }
  }

  statusBar.dispose()
  quickStatus(`$(cloud-download) Received ${saveFile.ObjectStates.length} scripts from TTS`)
}
