import { window } from 'vscode'
import { FileManager } from '@/vscode/fileManager'
import { quickStatus } from '@/vscode/statusBarManager'
import { addDefaultWorkDir, getWorkDir, isWorkdirDefault } from '@/vscode/workspaceManager'
import TTSService from '@/TTSService'
import getConfig from '@/utils/getConfig'
import { extractSave, readSave } from '@tts-tools/savefile'
import SaveFileTree from '@/utils/SaveFileTree'
import { type LoadingANewGame } from '@matanlurey/tts-editor'
import { prompts } from '@/vscode/windowManager'

export default async function getScripts (gameResponse?: LoadingANewGame): Promise<void> {
  if (await prompts.getScriptsTest()) return
  const statusBar = window.setStatusBarMessage('$(sync~spin) Receiving scripts')
  gameResponse = gameResponse ?? await TTSService.getApi().getLuaScripts()

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
      for (const path of new SaveFileTree(saveFile).getScriptPaths()) {
        void new FileManager(path).show()
      }
    }
  }

  statusBar.dispose()
  quickStatus(`$(cloud-download) Received ${saveFile.ObjectStates.length} scripts from TTS`)
}
