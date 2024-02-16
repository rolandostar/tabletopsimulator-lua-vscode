import { type LoadingANewGame } from '@matanlurey/tts-editor'
import * as LSS from '@/utils/LocalStorageService'

// This listener executes before others. It can modify the event object
// This will execute every time a new game is loaded OR scripts were requested.
export default async (e: LoadingANewGame): Promise<void> => {
  // Store save path to be used when saving and playing
  void LSS.set('lastSavePath', e.savePath)
  // NOTE - This is a good place to list all current objects to be used for object detection and hover highlighting
}
