import { type IncomingJsonObject } from '@matanlurey/tts-editor'
import { type TTSObject } from '@tts-tools/savefile'

/**
 * Returns a directory name from a TTSObject or IncomingJsonObject
 * @param object - The object to get the directory name from
 * @returns The directory name
 */
export default (object: TTSObject | IncomingJsonObject): string =>
  ('Nickname' in object
    ? `${object.Nickname.length > 0 ? object.Nickname : object.Name}.${object.GUID}`
    : `${object.name}.${object.guid}`).replace(/[^\w ^&'@{}[\],$=!\-#()%.+~_]/g, '-')
