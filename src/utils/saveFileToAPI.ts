import { type OutgoingJsonObject } from '@matanlurey/tts-editor'
import { type SaveFile } from '@tts-tools/savefile'

export default function saveFileToAPI (savefile: SaveFile): OutgoingJsonObject[] {
  const OutgoingObjects: OutgoingJsonObject[] = savefile.ObjectStates.map(obj => {
    return {
      guid: obj.GUID,
      script: obj.LuaScript,
      ui: obj.XmlUI
    }
  })
  OutgoingObjects.push({
    guid: '-1',
    script: savefile.LuaScript,
    ui: savefile.XmlUI
  })
  return OutgoingObjects
}
