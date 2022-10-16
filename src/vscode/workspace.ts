import { glob } from 'glob';
import * as os from 'os';
import * as path from 'path';
import { TextEncoder } from 'util';
import * as vscode from 'vscode';

import TTSWorkDir from '../TTSWorkDir';
import getConfig from '../utils/getConfig';
import { uriExists } from '../utils/simpleStat';

export const docsFolder = path.join(os.homedir(), 'Documents', 'Tabletop Simulator');

export function isPresent(dirUri: vscode.Uri) {
  const vsFolders = vscode.workspace.workspaceFolders;
  // If there are no folders in the workspace,
  // OR the requested dir in the workspace do not match any vscode folders path...
  return vsFolders && vsFolders.findIndex(vsDir => vsDir.uri.fsPath === dirUri.fsPath) !== -1;
}

/**
 * This method adds entries to the workspace explorer
 */
export function addDir2WS(dir: string, name?: string) {
  const vsFolders = vscode.workspace.workspaceFolders;
  const uri = vscode.Uri.file(dir);
  // Check if the folder is already present
  if (!isPresent(vscode.Uri.file(dir))) {
    // ...If not add it to the workspace
    vscode.workspace.updateWorkspaceFolders(vsFolders?.length ?? 0, null, {
      uri,
      name,
    });
  }
}

export function addWorkDirToWorkspace() {
  addDir2WS(TTSWorkDir.getUri().fsPath, 'In-Game Scripts');
}

/**
 * Because getLuaScripts will only return a list of present objects with scripts...
 * If a script is deleted, it won't be in the list.
 * This will remove all lua files not present in the `filesRecv` list
 */
export function syncFiles(filesRecv: vscode.Uri[]) {
  // If there are dirs, show warning
  if (
    TTSWorkDir.isDefault() && // If it's default Workdir
    !getConfig('misc.disableDirectoryWarning') && // The user didn't disable the warning
    glob.sync('*/', { cwd: TTSWorkDir.getUri().fsPath }).length > 0 // And there are dirs
  ) {
    vscode.window
      .showWarningMessage(
        'Directories detected in "In-Game Files"',
        {
          modal: true,
          detail:
            "It's recommended to store require'd files from an external folder instead.\n\nThis warning can be disabled under the extension settings.",
        },
        'Open Settings',
        'Learn More',
      )
      .then(res => {
        if (res === 'Open Settings')
          vscode.commands.executeCommand(
            'workbench.action.openSettings',
            'TTSLua: Disable Directory Warning',
          );
        else if (res === 'Learn More')
          vscode.env.openExternal(
            vscode.Uri.parse('https://tts-vscode.rolandostar.com/support/dirWarning'),
          );
      });
    return;
  }
  const filesRecvNames = filesRecv.map(h => path.basename(h.fsPath));
  //TODO: multi-extension support
  return Promise.all(
    glob
      .sync('*.lua', { cwd: TTSWorkDir.getUri().fsPath, nodir: true })
      .filter(file => !filesRecvNames.includes(file))
      .map(file =>
        vscode.workspace.fs.delete(vscode.Uri.file(path.join(TTSWorkDir.getUri().fsPath, file))),
      ),
  );
}

/**
 * This method "installs" the console++ extension into TTS.
 * All it does is copy the files from the extension's folder to the TTS docs folder.
 * @returns {Promise<void>} A promise that resolves when the file copying is complete
 */
export function installConsole(extensionPath: string) {
  const files = [
    {
      src: path.join(extensionPath, 'scripts', 'Console', 'console.lua'),
      dst: path.join(docsFolder, 'Console', 'console.lua'),
    },
    {
      src: path.join(extensionPath, 'scripts', 'Console', 'console++.lua'),
      dst: path.join(docsFolder, 'Console', 'console++.lua'),
    },
    {
      src: path.join(extensionPath, 'scripts', 'vscode', 'console.lua'),
      dst: path.join(docsFolder, 'vscode', 'console.lua'),
    },
  ];
  return Promise.all(
    files.map(file =>
      vscode.workspace.fs.copy(vscode.Uri.file(file.src), vscode.Uri.file(file.dst), {
        overwrite: true,
      }),
    ),
  )
    .then(() => {
      vscode.window.showInformationMessage('Console++ Installation Successful');
    })
    .catch(reason => {
      vscode.window.showErrorMessage(`Console++ Installation Failed: ${reason}`);
    });
}

export class FileManager {
  private FileUri: vscode.Uri;

  public constructor(public filename: string, fromWorkDir = true) {
    this.FileUri = fromWorkDir
      ? vscode.Uri.file(path.normalize(path.join(TTSWorkDir.getUri().fsPath, filename)))
      : vscode.Uri.file(path.normalize(filename));
  }

  public async write(text: string) {
    // Check if path.dirname exists
    const dir = vscode.Uri.file(path.dirname(this.FileUri.fsPath));
    if (!(await uriExists(dir))) await vscode.workspace.fs.createDirectory(dir);
    return vscode.workspace.fs.writeFile(this.FileUri, new TextEncoder().encode(text));
  }

  public async read() {
    try {
      const r = await vscode.workspace.fs.readFile(this.FileUri);
      return r.toString();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public open(options?: { preserveFocus?: boolean; preview?: boolean }) {
    const { preserveFocus = true, preview = false } = options ?? {};
    return new Promise((resolve, reject) => {
      vscode.window
        .showTextDocument(this.FileUri, { preserveFocus, preview })
        .then(resolve, reject);
    });
  }

  public getUri() {
    return this.FileUri;
  }
}
