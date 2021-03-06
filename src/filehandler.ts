import { tmpdir, homedir } from 'os';
import { join, normalize, dirname } from 'path';
import { workspace as ws, window as wd, Uri } from 'vscode';

export const tempFolder = join(tmpdir(), 'TabletopSimulator', 'Tabletop Simulator Lua');
export const docsFolder = join(homedir(), 'Documents', 'Tabletop Simulator');

export async function createWorkspaceFolder() {
  try {
    await ws.fs.createDirectory(Uri.file(tempFolder));
  } catch (reason: any) { wd.showErrorMessage(`Failed to create workspace folder: ${reason}`); }
}

export async function addDocsFolderToWorkspace() {
  const vsFolders = ws.workspaceFolders;
  const docsUri = Uri.file(docsFolder);
  if (!vsFolders || vsFolders.findIndex((dir) => dir.uri.fsPath === docsUri.fsPath) === -1) {
    ws.updateWorkspaceFolders(vsFolders ? vsFolders.length : 0, null, {
      uri: docsUri,
      name: 'TTS Includes',
    });
  }
}

export async function installConsole(extensionPath: string) {
  const srcUri1 = Uri.file(join(extensionPath, 'scripts', 'Console'));
  const dstUri1 = Uri.file(join(docsFolder, 'Console'));

  const srcUri2 = Uri.file(join(extensionPath, 'scripts', 'vscode'));
  const dstUri2 = Uri.file(join(docsFolder, 'vscode'));
  try {
    await ws.fs.copy(srcUri1, dstUri1, { overwrite: true });
    await ws.fs.copy(srcUri2, dstUri2, { overwrite: true });
  } catch (reason: any) { wd.showErrorMessage(`Console++ Installation Failed: ${reason}`); }
  wd.showInformationMessage('Console++ Installation Successful');
}

export class FileHandler {
  private FileUri: Uri;

  public constructor(basename: string) {
    this.FileUri = Uri.file(normalize(join(tempFolder, basename)));
  }

  public create(text: string) {
    ws.fs.createDirectory(Uri.file(dirname(this.FileUri.fsPath))).then(() => {
      ws.fs.writeFile(this.FileUri, Buffer.from(text, 'utf8'));
    });
  }

  public open() {
    return wd.showTextDocument(this.FileUri, {
      preserveFocus: true,
      preview: false,
    });
  }
}
