import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';

import LocalStorageService from '@/vscode/LocalStorageService';

const defaultWorkDir = path.join(os.tmpdir(), 'TabletopSimulator', 'Tabletop Simulator');

function getGitDirs() {
  const vsFolders = vscode.workspace.workspaceFolders || [];
  return Promise.allSettled(
    vsFolders.map(folder =>
      vscode.workspace.fs.stat(vscode.Uri.file(path.join(folder.uri.fsPath, '.git')))
    ) ?? []
  ).then(settledArray =>
    settledArray.reduce((acc, cur, idx) => {
      if (cur.status === 'fulfilled') {
        acc.push(vsFolders[idx]);
      }
      return acc;
    }, [] as vscode.WorkspaceFolder[])
  );
}

export default class TTSWorkDir {
  public static instance: TTSWorkDir;
  private workDirUri: vscode.Uri = vscode.Uri.file(
    LocalStorageService.getOrSet('workDir', defaultWorkDir)
  );
  private sItem: vscode.StatusBarItem = this.createStatusBarItem();

  public constructor() {
    // Check if the workDir is currently opened in the workspace
    // If not, return to default
    if (
      !this.isDefault() &&
      !vscode.workspace.workspaceFolders?.some(
        folder => folder.uri.fsPath === this.workDirUri.fsPath
      )
    )
      this.reset();

    // Check if Temp folder exists, if not create it
    if (this.isDefault()) {
      vscode.workspace.fs.createDirectory(this.workDirUri).then(
        () => {},
        (reason: unknown) => {
          vscode.window.showErrorMessage(`Failed to create workspace folder: ${reason}`);
          throw new Error(`Failed to create workspace folder: ${reason}`);
        }
      );
    }

    // Handle new workspaces
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      this.updateStatusBarColors();
    });
    this.updateStatusBarColors();

    TTSWorkDir.instance = this;
  }

  // TODO: [every time there is asave, copy game save to git root]
  // TODO: another command can export game assets to git format

  public async changeWorkDir() {
    // Check which of the folders in the workspace are git repos
    const gitDirs = await getGitDirs();
    if (gitDirs.length === 0) {
      // If there are no repos but the workDir is not default, reset it
      if (!this.isDefault()) {
        this.reset();
        return;
      }
      vscode.window
        .showErrorMessage('No git repositories found in workspace', 'Learn More')
        .then(res => {
          if (res === 'Learn More')
            vscode.env.openExternal(
              vscode.Uri.parse('https://tts-vscode.rolandostar.com/guides/versionControl')
            );
        });
      return;
    }
    // Prompt for which one to use
    const selection = await vscode.window.showQuickPick(
      [...gitDirs.map(d => d.uri.fsPath), '$(refresh) Default'],
      {
        placeHolder: 'Select new working directory to store TTS scripts',
      }
    );
    // Handle Cancel
    if (selection === undefined) return;
    if (selection !== '$(refresh) Default') {
      // Any selection but default
      const newWorkDir = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(selection))!;
      LocalStorageService.setValue('workDir', newWorkDir.uri.fsPath);
      this.workDirUri = newWorkDir.uri;
      this.sItem.text = `$(root-folder) TTS [${newWorkDir.name}]`;
    } else this.reset();
    this.updateStatusBarColors();
  }

  private async updateStatusBarColors() {
    // Color will be default when workDir has a git repo selected
    // Color will be error when there are git repos detected but none selected
    // Color will be warning when there are no git repos detected

    const gitRepos = await getGitDirs();
    const isDefault = this.isDefault();
    const repoDetected = gitRepos.length > 0;
    if (isDefault !== repoDetected) {
      this.sItem.backgroundColor = new vscode.ThemeColor('statusBarItem.defaultBackground');
      this.sItem.color = new vscode.ThemeColor('statusBarItem.defaultForeground');
    } else {
      if (repoDetected) {
        this.sItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        this.sItem.color = new vscode.ThemeColor('statusBarItem.warningForeground');
      } else {
        this.sItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        this.sItem.color = new vscode.ThemeColor('statusBarItem.errorForeground');
      }
    }
    this.sItem.show();
  }

  private createStatusBarItem() {
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    const folder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(this.workDirUri.fsPath));
    if (!this.isDefault() && folder) {
      statusBarItem.text = `$(root-folder) TTS [${folder.name}]`;
    } else {
      statusBarItem.text = '$(root-folder) TTS [Default]';
    }
    statusBarItem.command = 'ttslua.changeWorkDir';
    statusBarItem.tooltip = new vscode.MarkdownString(
      'Click to select TTSLua working directory [[Learn More]](https://ttslua.rolandostar.com/guides/versionControl)'
    );
    // statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    // statusBarItem.color = new vscode.ThemeColor('statusBarItem.warningForeground');
    return statusBarItem;
  }

  public getUri() {
    return this.workDirUri;
  }

  public isDefault() {
    return (
      this.workDirUri.fsPath.localeCompare(defaultWorkDir, undefined, {sensitivity: 'accent'}) === 0
    );
  }

  public reset() {
    this.workDirUri = vscode.Uri.file(defaultWorkDir);
    LocalStorageService.setValue('workDir', this.workDirUri.fsPath);
    this.sItem.text = '$(root-folder) TTS [Default]';
  }

  public readFile(filename: string) {
    return vscode.workspace.fs.readFile(
      vscode.Uri.file(path.join(this.workDirUri.fsPath, filename))
    );
  }

  public getFileUri(filename: string) {
    return vscode.Uri.file(path.join(this.workDirUri.fsPath, filename));
  }
}
