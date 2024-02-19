import TTSConsolePanel from '@/TTSConsole'

import { type PrintDebugMessage } from '@matanlurey/tts-editor'

export default (e: PrintDebugMessage): void => {
  void TTSConsolePanel.currentPanel?.append(e.message)
}
