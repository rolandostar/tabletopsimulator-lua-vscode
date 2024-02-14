// import { FileManager } from '@/vscode/fileManager'
// import { type GameObject } from '../CustomExternalEditorApi'
// import { stringify } from 'yaml'
// import { type ObjectState, type SaveState } from '@matanlurey/tts-save-files'
// import sanitizeFilename from '@/utils/sanitizeFilename'

// const SettingsFileMap = [
//   { name: 'TabStates.yml', elements: ['TabStates'] },
//   { name: 'Grid.yml', elements: ['Grid'] },
//   { name: 'Lighting.yml', elements: ['Lighting'] },
//   { name: 'Decals.yml', elements: ['DecalPallet', 'Decals'] },
//   { name: 'SnapPoints.yml', elements: ['SnapPoints'] },
//   {
//     name: 'Game.yml',
//     inverse: true, // Inverse, catch all BUT the defined elements
//     elements: ['LuaScript', 'XmlUI', 'ObjectStates']
//   }
// ]

// function filterObjectProps (object: ObjectState): ObjectState {
//   // Remove certain properties from object and return filtered object
//   const filteredObject = Object.assign({}, object)
//   delete filteredObject.LuaScript
//   delete filteredObject.XmlUI
//   delete filteredObject.GUID
//   delete filteredObject.ContainedObjects
//   return filteredObject
// }

// function unpackObjects (objects: ObjectState[], location: string): GameObject[] {
//   const results: GameObject[] = []
//   for (const object of objects) {
//     const name = sanitizeFilename(object.Nickname.length > 0
//       ? object.Nickname
//       : object.Name)
//     if (object.ContainedObjects != null) {
//       results.push(...unpackObjects(object.ContainedObjects, `${location}${name}.${object.GUID ?? '-1'}/ContainedObjects/`))
//     }
//     results.push({
//       name,
//       guid: object.GUID ?? '-1',
//       objectProps: stringify(filterObjectProps(object)),
//       location: location + (object.ContainedObjects !== undefined ? `${name}.${object.GUID ?? '-1'}/` : ''),
//       script: object.LuaScript,
//       ui: object.XmlUI
//     })
//   }
//   return results
// }

// export default async function prepareGameObjects (
//   saveContent: SaveState
// ): Promise<GameObject[]> {
//   const skipList: string[] = []
//   for (const file of SettingsFileMap) {
//     const fileMgr = new FileManager(`settings/${file.name}`)
//     const content: any = {}
//     // Copy each element from the save file to the new file
//     if (file.inverse === undefined || !file.inverse) {
//       for (const element of file.elements) {
//         skipList.push(element)
//         content[element] = saveContent[element as keyof SaveState]
//       }
//     } else {
//       skipList.push(...file.elements)
//       // Copy all elements that are not in the skip list
//       for (const element of Object.keys(saveContent)) {
//         if (!skipList.includes(element)) {
//           content[element] = saveContent[element as keyof SaveState]
//         }
//       }
//     }

//     await fileMgr.write(stringify(content))
//   }
//   const results: GameObject[] = [
//     {
//       name: 'Global',
//       guid: '-1',
//       script: saveContent.LuaScript,
//       ui: saveContent.XmlUI
//     }
//   ]
//   results.push(...unpackObjects(saveContent.ObjectStates, 'objects/'))

//   return results
// }
