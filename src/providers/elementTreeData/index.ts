/**
 * @file Tree Data Provider
 *
 */

import * as vscode from 'vscode'
import { type TTSItem, TTSObjectItem } from './TTSItem'
import SaveFileStorage from '@/utils/SaveFileTree'

export default class TTSElementTreeDataProvider implements vscode.TreeDataProvider<TTSItem> {
  getTreeItem = (element: TTSItem): TTSItem => element
  async getChildren (element?: TTSItem): Promise<TTSItem[]> {
    return element === undefined ? this.getAllObjects() : this.getObjectContent(element)
  }

  private readonly getAllObjects = (): TTSObjectItem[] => {
    return SaveFileStorage.get().saveFile.ObjectStates.map(obj => new TTSObjectItem(obj))
  }

  private readonly getObjectContent = (element: TTSItem): TTSItem[] => {
    return []
  }

  // private readonly _onDidChangeTreeData: vscode.EventEmitter<TTSItem | undefined | null> = new vscode.EventEmitter<TTSItem | undefined | null>()
  // readonly onDidChangeTreeData: vscode.Event<TTSItem | undefined | null > = this._onDidChangeTreeData.event

  private readonly changeEvent = new vscode.EventEmitter<void>()
  public get onDidChangeTreeData (): vscode.Event<void> {
    return this.changeEvent.event
  }

  refresh (): void {
    this.changeEvent.fire()
  }
}
