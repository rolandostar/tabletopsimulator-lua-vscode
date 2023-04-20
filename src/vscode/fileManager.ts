/**
 * @file File Manager
 * This class is used to manage files. It's used to write files, check if they exist, and more.
 * By default it uses the workspace directory as the root directory.
 * This can be changed by passing `false` to the `fromWorkDir` parameter in the constructor.
 */

import { normalize, join, dirname } from 'path'
import { Uri, workspace, window, type TextEditor, Position } from 'vscode'
import { getWorkDir } from './workspaceManager'
import uriExists from '@/utils/uriExists'

export class FileManager {
  private readonly FileUri: Uri

  public constructor (public filename: string | Uri, fromWorkDir = true) {
    if (typeof filename === 'string') {
      this.FileUri = fromWorkDir
        ? Uri.file(normalize(join(getWorkDir().fsPath, filename)))
        : Uri.file(normalize(filename))
    } else this.FileUri = filename
  }

  public async write (text: string): Promise<void> {
    // Check if path.dirname exists
    const dir = Uri.file(dirname(this.FileUri.fsPath))
    if (!(await uriExists(dir))) await workspace.fs.createDirectory(dir)
    await workspace.fs.writeFile(this.FileUri, new TextEncoder().encode(text))
  }

  public async read (): Promise<string> {
    return (await Promise.resolve(workspace.fs.readFile(this.FileUri))).toString()
  }

  public async show ({ preserveFocus = true, preview = false } = {}): Promise<TextEditor> {
    return await Promise.resolve(window.showTextDocument(this.FileUri, { preserveFocus, preview }))
  }

  public async open (content: string, { preserveFocus = true, preview = false } = {}): Promise<TextEditor> {
    const doc = await workspace.openTextDocument(this.FileUri.with({ scheme: 'untitled' }))
    const editor = await window.showTextDocument(doc, { preserveFocus, preview })
    await editor.edit((edit) => {
      edit.insert(new Position(0, 0), content)
    })
    return editor
  }

  public async erase (): Promise<void> {
    await Promise.resolve(workspace.fs.delete(this.FileUri))
  }

  public getUri (): Uri { return this.FileUri }
}
