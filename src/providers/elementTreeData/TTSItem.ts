import { ThemeIcon, TreeItem, TreeItemCollapsibleState, window } from 'vscode'
import { type TTSObject } from '@tts-tools/savefile'
// export type TTSItem = TTSObjectItem | TTSScriptItem | TTSFiletItem

export type TTSItem = TTSObjectItem

export class TTSObjectItem extends TreeItem {
  constructor (object: TTSObject) {
    super(object.Name, TreeItemCollapsibleState.Collapsed)
  }
}

// export class TTSFiletItem extends TreeItem {
//   public readonly object: LoadedObject
//   private readonly extension: string

//   constructor (object: LoadedObject, name: string, extension: string) {
//     super(name)
//     this.object = object
//     this.extension = extension
//     this.contextValue = 'file'
//     this.iconPath = ThemeIcon.File
//     this.resourceUri = getOutputFileUri(this.fileName())

//     this.command = {
//       title: 'Open file',
//       command: 'vscode.open',
//       arguments: [getOutputFileUri(this.fileName())]
//     }
//   }

//   protected fileName = () => `${this.object.fileName}.${this.extension}`
// }

// export class TTSScriptItem extends TTSFiletItem {
//   constructor (object: LoadedObject, name: string, extension: string) {
//     super(object, name, extension)
//     this.contextValue = 'script'
//   }

//   openBundledScript = () => {
//     window.showTextDocument(getOutputFileUri(this.fileName(), true))
//   }
// }
