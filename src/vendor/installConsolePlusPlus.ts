import { workspace, window, Uri, env } from 'vscode'
import { join } from 'path'
import docsFolder from '@/utils/docsFolder'

/**
 * This method "installs" the console++ extension into TTS.
 * All it does is copy the files from the extension's folder to the TTS docs folder.
 * @returns {Promise<void>} A promise that resolves when the file copying is complete
 */
export async function installConsole (extensionPath: string): Promise<void> {
  const files = [
    {
      src: join(extensionPath, 'scripts', 'Console', 'console.lua'),
      dst: join(docsFolder, 'Console', 'console.lua')
    },
    {
      src: join(extensionPath, 'scripts', 'Console', 'console++.lua'),
      dst: join(docsFolder, 'Console', 'console++.lua')
    },
    {
      src: join(extensionPath, 'scripts', 'vscode', 'console.lua'),
      dst: join(docsFolder, 'vscode', 'console.lua')
    }
  ]
  await Promise.all(
    files.map(file =>
      workspace.fs.copy(Uri.file(file.src), Uri.file(file.dst), {
        overwrite: true
      })
    )
  )
    .then(() => {
      const openInstallLocation = 'Open Install Location'
      return window.showInformationMessage('Console++ Installation Successful', openInstallLocation)
        .then(s => s === openInstallLocation ? env.openExternal(Uri.file(docsFolder)) : undefined)
    })
    .catch(reason => {
      return window.showErrorMessage(`Console++ Installation Failed: ${reason}`)
    })
}
