/**
 * @file Tree Data Provider
 *
 */

import TTSService from '@/TTSService'
import type * as vscode from 'vscode'

export default class TTSElementDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  getTreeItem (element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element
  }

  getChildren (element?: any | undefined): vscode.ProviderResult<any[]> {
    // if (element) {
    //   if (element instanceof TTSObjectItem) {
    //     return Promise.resolve(this.getObjectContent(element))
    //   }
    //   return Promise.resolve([])
    // } else {
    //   return Promise.resolve(this.getLoadedObjects())
    // }
    return Promise.resolve([])
  }
}
