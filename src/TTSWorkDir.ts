import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

import LocalStorageService from './vscode/LocalStorageService';

const defaultWorkDir = path.join(os.tmpdir(), 'TabletopSimulatorLua');

function getGitDirs() {
  const vsFolders = vscode.workspace.workspaceFolders || [];
  return Promise.allSettled(
    vsFolders.map((folder) =>
      vscode.workspace.fs.stat(vscode.Uri.file(path.join(folder.uri.fsPath, '.git'))),
    ) ?? [],
  ).then((settledArray) =>
    settledArray.reduce((acc, cur, idx) => {
      if (cur.status === 'fulfilled') {
        acc.push(vsFolders[idx]);
      }
      return acc;
    }, [] as vscode.WorkspaceFolder[]),
  );
}

export default abstract class TTSWorkDir {
  private static workDirUri = vscode.Uri.file(defaultWorkDir);
  private static sItem: vscode.StatusBarItem = TTSWorkDir.createStatusBarItem();

  public static init() {
    TTSWorkDir.workDirUri = vscode.Uri.file(
      LocalStorageService.getOrSet('workDir', defaultWorkDir),
    );
    // Check if the workDir is currently opened in the workspace
    // If not, return to default
    if (
      !vscode.workspace.workspaceFolders?.some(
        (folder) => folder.uri.fsPath === TTSWorkDir.workDirUri.fsPath,
      )
    )
      TTSWorkDir.reset();

    // Check if Temp folder exists, if not create it
    if (TTSWorkDir.isDefault()) {
      vscode.workspace.fs
        .createDirectory(TTSWorkDir.workDirUri)
        .then(undefined, (reason: unknown) => {
          vscode.window.showErrorMessage(`Failed to create workspace folder: ${reason}`);
          throw new Error(`Failed to create workspace folder: ${reason}`);
        });
    }

    // Handle new workspaces
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      TTSWorkDir.updateStatusBarColors();
    });
    TTSWorkDir.updateStatusBarColors();
  }

  // TODO: another command can export game assets to git format

  public static async changeWorkDir() {
    // Check which of the folders in the workspace are git repos
    const gitDirs = await getGitDirs();
    if (gitDirs.length === 0) {
      // If there are no repos but the workDir is not default, reset it
      if (!TTSWorkDir.isDefault()) {
        TTSWorkDir.reset();
        return;
      }
      vscode.window
        .showErrorMessage('No git repositories found in workspace', 'Learn More')
        .then((res) => {
          if (res === 'Learn More')
            vscode.env.openExternal(
              vscode.Uri.parse('https://tts-vscode.rolandostar.com/guides/versionControl'),
            );
        });
      return;
    }
    // Prompt for which one to use
    const selection = await vscode.window.showQuickPick(
      [...gitDirs.map((d) => d.uri.fsPath), '$(refresh) Default'],
      {
        placeHolder: 'Select new working directory to store TTS scripts',
      },
    );
    // Handle Cancel
    if (selection === undefined) return;
    if (selection !== '$(refresh) Default') {
      // Any selection but default
      const newWorkDir = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(selection));
      if (newWorkDir === undefined) {
        vscode.window.showErrorMessage('Failed to get workspace folder, please try again');
        return;
      }
      LocalStorageService.setValue('workDir', newWorkDir.uri.fsPath);
      TTSWorkDir.workDirUri = newWorkDir.uri;
      TTSWorkDir.sItem.text = `$(root-folder) TTS [${newWorkDir.name}]`;
    } else TTSWorkDir.reset();
    TTSWorkDir.updateStatusBarColors();
  }

  private static async updateStatusBarColors() {
    // Color will be default when workDir has a git repo selected
    // Color will be error when there are git repos detected but none selected
    // Color will be warning when there are no git repos detected

    const gitRepos = await getGitDirs();
    const isDefault = TTSWorkDir.isDefault();
    const repoDetected = gitRepos.length > 0;
    if (isDefault !== repoDetected) {
      TTSWorkDir.sItem.backgroundColor = new vscode.ThemeColor('statusBarItem.defaultBackground');
      TTSWorkDir.sItem.color = new vscode.ThemeColor('statusBarItem.defaultForeground');
    } else {
      if (repoDetected) {
        TTSWorkDir.sItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        TTSWorkDir.sItem.color = new vscode.ThemeColor('statusBarItem.warningForeground');
      } else {
        TTSWorkDir.sItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        TTSWorkDir.sItem.color = new vscode.ThemeColor('statusBarItem.errorForeground');
      }
    }
    TTSWorkDir.sItem.show();
  }

  private static createStatusBarItem() {
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    const folder = vscode.workspace.getWorkspaceFolder(
      vscode.Uri.file(TTSWorkDir.workDirUri.fsPath),
    );
    if (!TTSWorkDir.isDefault() && folder) {
      statusBarItem.text = `$(root-folder) TTS [${folder.name}]`;
    } else {
      statusBarItem.text = '$(root-folder) TTS [Default]';
    }
    statusBarItem.command = 'ttslua.changeWorkDir';
    statusBarItem.tooltip = new vscode.MarkdownString(
      'Click to select TTSLua working directory [[Learn More]](https://tts-vscode.rolandostar.com/guides/versionControl)',
    );
    // statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    // statusBarItem.color = new vscode.ThemeColor('statusBarItem.warningForeground');
    return statusBarItem;
  }

  public static getUri() {
    return TTSWorkDir.workDirUri;
  }

  public static isDefault() {
    return (
      TTSWorkDir.workDirUri.fsPath.localeCompare(defaultWorkDir, undefined, {
        sensitivity: 'accent',
      }) === 0
    );
  }

  public static reset() {
    TTSWorkDir.workDirUri = vscode.Uri.file(defaultWorkDir);
    LocalStorageService.setValue('workDir', TTSWorkDir.workDirUri.fsPath);
    TTSWorkDir.sItem.text = '$(root-folder) TTS [Default]';
  }

  public static readFile(filename: string) {
    return vscode.workspace.fs.readFile(
      vscode.Uri.file(path.join(TTSWorkDir.workDirUri.fsPath, filename)),
    );
  }

  public static getFileUri(filename: string) {
    return vscode.Uri.file(path.join(TTSWorkDir.workDirUri.fsPath, filename));
  }
}
