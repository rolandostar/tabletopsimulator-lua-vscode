import TTSConsolePanel from '@/TTSConsole'
import { type GameSaved } from '@matanlurey/tts-editor'
import getConfig from '@/utils/getConfig'

export default async (e: GameSaved): Promise<void> => {
  const isAutoSave = e.savePath.includes('TS_AutoSave')
  if (!getConfig<boolean>('console.logSaves')) return
  const d = new Date()
  const h = `${d.getHours()}`.padStart(2, '0')
  const m = `${d.getMinutes()}`.padStart(2, '0')
  const s = `${d.getSeconds()}`.padStart(2, '0')
  const timestamp = `${h}:${m}:${s}`
  await TTSConsolePanel.currentPanel?.append(
    `[${timestamp}] ` + (isAutoSave ? '↩️ Game Autosaved' : '💾 Game Saved'),
    { classes: ['save'] }
  )
}
