// REVIEW - Docs
// This file must export an array of event's names and the functions that should be called when the event is triggered.
// The event name is based on the filename where the function is defaultly exported from.
// This is done dinamycally so that when adding new events this file does not need to be updated.

import importFolder from '@/utils/importFolder'
import { type ReceivedEventNames, type ReceivedEventTypes } from '@matanlurey/tts-editor'
import { basename } from 'path'

export default importFolder(require.context('./listeners', false, /\.ts$/))
  .map(({ file, content }) => {
    return {
      eventName: basename(file, '.ts') as ReceivedEventNames,
      handler: content.default as (e: ReceivedEventTypes) => void
    }
  })
