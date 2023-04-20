import { type ObjectCreated } from '@matanlurey/tts-editor'

export default (e: ObjectCreated): void => {
  console.log('Object created')
  console.log(e)
}
