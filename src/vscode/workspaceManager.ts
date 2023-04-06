import { tmpdir } from 'os'
import { join } from 'path'
import {
  Uri, window, StatusBarAlignment, workspace, env,
  type WorkspaceFoldersChangeEvent,
  type WorkspaceFolder, Disposable
} from 'vscode'
import * as LSS from '@Utils/LocalStorageService'
import { changeTheme, createStatusBarItem } from './statusBarManager'
import L from '@/i18n'
import { workDirCreateFailed } from './errorHandler'

const defaultWorkDir = join(tmpdir(), 'TabletopSimulatorLua')
const statusBarItem = createStatusBarItem({
  align: StatusBarAlignment.Left,
  priority: 1,
  command: 'ttslua.changeWorkDir',
  tooltip: L.workDir.hover()
})
let workDirUri = Uri.file(defaultWorkDir)

/**
 * @returns True if currently selected workDir is the default workDir
 */
function isDefault (): boolean {
  return workDirUri.fsPath.localeCompare(defaultWorkDir, undefined, {
    sensitivity: 'accent'
  }) === 0
}

/**
 * Calling this function will reset the workDir to the default workDir
 */
function reset (): void {
  workDirUri = Uri.file(defaultWorkDir)
  void LSS.set('workDir', workDirUri.fsPath)
  statusBarItem.text = `$(root-folder) TTS [${L.workDir.defaultTag()}]`
}

/**
 * This function will stat every opened workspace folder and check if it contains a .git folder
 * @returns An array of WorkspaceFolder objects that contain a .git folder
 */
async function getGitFolders (): Promise<WorkspaceFolder[]> {
  const vsFolders = workspace.workspaceFolders ?? []
  // Find folders in workspace containing .git folder
  const settledPromises = await Promise.allSettled(vsFolders.map(
    async folder => {
      await Promise.resolve(workspace.fs.stat(Uri.file(join(folder.uri.fsPath, '.git'))))
      // If it doesn't reject, return the WorkspaceFolder that was checked
      return folder
    }
  ))
  // Keep only the fulfilled promises
  return settledPromises.reduce<WorkspaceFolder[]>((accumulator, settledPromises) => {
    if (settledPromises.status === 'fulfilled') accumulator.push(settledPromises.value)
    return accumulator
  }, [])
}

/**
 * This function will update the status bar to reflect the current workDir
 * It will also check if the workDir is a git repo and change the color accordingly
 * @param e WorkspaceFoldersChangeEvent, set automatically when called by the event listener
 */
async function updateStatusBar (_e?: WorkspaceFoldersChangeEvent): Promise<void> {
  // Color will be default when workDir has a git repo selected
  // Color will be error when there are git repos detected but none selected
  // Color will be warning when there are no git repos detected
  // Get all git repos in workspace
  const gitFolders = await getGitFolders()
  // Get currently selected workspace folder Uri
  const folder = workspace.getWorkspaceFolder(Uri.file(workDirUri.fsPath))
  // Update Status bar accordingly
  const dfault = L.workDir.defaultTag()
  statusBarItem.text = `$(root-folder) TTS [${!isDefault() ? folder?.name ?? dfault : dfault}]`
  const _isDefault = isDefault()
  switch (true) {
    case gitFolders.length > 0 && !_isDefault:
      changeTheme(statusBarItem, 'default')
      break
    case gitFolders.length > 0 && _isDefault:
      changeTheme(statusBarItem, 'error')
      break
    case gitFolders.length === 0:
      changeTheme(statusBarItem, 'warning')
      break
  }
}

/**
 * This function will initialize the workspace manager
 *
 * It will perform checks to ensure the workdir is valid and update the status bar to reflect the
 * current workDir
 */
export async function initWorkspace (): Promise<Disposable> {
  // Check if workDir is set in localStorage
  workDirUri = Uri.file(LSS.querySet('workDir', defaultWorkDir))
  // Check if the workDir is currently opened in the workspace
  // If not, return to default
  if (workspace.workspaceFolders?.some(
    folder => folder.uri.fsPath === workDirUri.fsPath
  ) === false) reset()
  // Check if Temp folder exists, if not create it
  if (isDefault()) await Promise.resolve(workspace.fs.createDirectory(workDirUri)).catch(workDirCreateFailed)
  // Update on new workspaces
  workspace.onDidChangeWorkspaceFolders(updateStatusBar)
  void updateStatusBar()
  return new Disposable(statusBarItem.dispose)
}

/**
 * This command will prompt the user for a new workDir to be used
 */
export async function changeWorkDir (): Promise<void> {
  const gitFolders = await getGitFolders()
  // If there are no git repos detected
  if (gitFolders.length === 0) {
    // If workDir is not default, reset it
    if (!isDefault()) { reset(); return }
    // If workDir is default, show error message
    void window.showErrorMessage(L.workDir.noGitReposInWorkspace(), L.docs.learnMore())
      .then(res => {
        if (res === L.docs.learnMore()) { void env.openExternal(Uri.parse(L.docs.urls.versionControl())) }
      }); return
  }
  // If git repos are detected prompt for which one to use
  const selection = await window.showQuickPick(
    [...gitFolders.map(d => d.uri.fsPath), `$(refresh) ${L.workDir.defaultTag()}`],
    { placeHolder: L.workDir.quickPickPlaceHolder() }
  )
  // Handle Cancel
  if (selection === undefined) return
  if (selection !== `$(refresh) ${L.workDir.defaultTag()}`) {
    // Any selection but default
    const newWorkDir = workspace.getWorkspaceFolder(Uri.file(selection))
    if (newWorkDir === undefined) {
      void window.showErrorMessage(L.workDir.failedToSelect())
      return
    }
    void LSS.set('workDir', newWorkDir.uri.fsPath)
    workDirUri = newWorkDir.uri
    statusBarItem.text = `$(root-folder) TTS [${newWorkDir.name}]`
  } else reset()
  void updateStatusBar()
}

/**
 * This function will read the contents of a file in the workDir
 * @param filename filename to be read in current WorkDir
 * @returns Promise that resolves to the contents of the file
 */
export async function readFile (filename: string): Promise<Uint8Array> {
  return await Promise.resolve(workspace.fs.readFile(
    Uri.file(join(workDirUri.fsPath, filename))
  ))
}

/**
 * Returns a URI of the filename in the workdir
 * @param filename
 * @returns Uri of the file
 */
export function getFileUri (filename: string): Uri {
  return Uri.file(join(workDirUri.fsPath, filename))
}
