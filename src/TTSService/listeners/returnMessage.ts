import TTSConsolePanel from '@/TTSConsole'
import { type ReturnMessage } from '@matanlurey/tts-editor'
import { window } from 'vscode'

export default async (e: ReturnMessage): Promise<void> => {
  if (TTSConsolePanel.currentPanel?.isVisible() ?? false) {
    await TTSConsolePanel.currentPanel?.append(e.returnValue as string, { classes: ['callout', 'return'] })
  } else void window.showInformationMessage(e.returnValue as string)
}
