import { type LoadingANewGame } from '@matanlurey/tts-editor'
import * as LSS from '@/utils/LocalStorageService'

// This listener executes before others. It can modify the event object
// This will execute every time a new game is loaded OR scripts were requested.
export default (e: LoadingANewGame): void => {
  void LSS.set('lastSavePath', e.savePath)
  console.log('Loading a new game')
  // console.dir(e)
}
