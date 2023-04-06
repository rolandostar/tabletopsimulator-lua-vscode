import importFolder from '@Utils/importFolder'
import {
  type CustomMessage,
  type ErrorMessage,
  type GameSaved,
  type LoadingANewGame,
  type ObjectCreated,
  type PrintDebugMessage,
  type PushingNewObject,
  type ReturnMessage
} from '@matanlurey/tts-editor'

/**
 *  This file exports all other files in this directory making use of the importFolder function.
 */

export default importFolder(
  require.context('./', false, /\.ts$/),
  (name: string) => name !== './index.ts'
) as Array<{
  eventname:
  'pushingNewObject' | 'loadingANewGame' | 'printDebugMessage' | 'errorMessage' |
  'customMessage' | 'returnMessage' | 'gameSaved' | 'objectCreated'
  callback: (e:
  PushingNewObject | LoadingANewGame | PrintDebugMessage | ErrorMessage |
  CustomMessage | ReturnMessage | GameSaved | ObjectCreated
  ) => void
}>
