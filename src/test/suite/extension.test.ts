import * as os from 'os';
import * as path from 'path';

import * as assert from 'assert';
import { before } from 'mocha';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import TTSWorkDir from '../../TTSWorkDir';
import * as workspace from '../../vscode/workspace';

suite('Extension Test Suite', async () => {
  let extension: vscode.Extension<unknown> | undefined;
  let extensionContext: vscode.ExtensionContext;

  suiteSetup(async () => {
    // Make sure extension is activated
    await vscode.extensions.getExtension('draivin.hscopes')?.activate();
    extension = await vscode.extensions.getExtension('rolandostar.tabletopsimulator-lua');
    extension?.activate();
    extensionContext = (global as any).testExtensionContext;
    // Set up workspace
    // LocalStorageService.storage = extensionContext.globalState;
  });

  suite('Command Registration', () => {
    let registeredCommands: string[] = [];
    before(async () => {
      registeredCommands = await vscode.commands.getCommands(true);
    });
    const commandsToTest = [
      { commandId: 'ttslua.forceAutocompleteUpdate' },
      { commandId: 'ttslua.updateCompletionItems' },
      { commandId: 'ttslua.addGlobalInclude' },
      { commandId: 'ttslua.openConsole' },
      { commandId: 'ttslua.installConsole' },
      { commandId: 'ttslua.saveAndPlay' },
      { commandId: 'ttslua.getScripts' },
      { commandId: 'ttslua.executeLua' },
    ];

    console.log('Starting Command Registration Tests');
    for (const command of commandsToTest) {
      test(`Command ${command.commandId} is registered`, async () => {
        assert.ok(registeredCommands.includes(command.commandId));
      });
    }
  });

  suite('Workspace Management Tests', () => {
    test('docsFolder must be available', () => {
      assert.strictEqual(
        workspace.docsFolder,
        path.join(os.homedir(), 'Documents', 'Tabletop Simulator'),
      );
    });
    test('default workFolder must point to temp location', () => {
      assert.strictEqual(
        TTSWorkDir.getUri().fsPath.toUpperCase(),
        path.join(os.tmpdir(), 'TabletopSimulatorLua').toUpperCase(),
      );
    });
    test('Test adding a directory to the workspace', () => {
      // Add the docs folder to the workspace
      workspace.addDir2WS(workspace.docsFolder, 'DocsFolder');
      // Check that the docs folder was added
      const wsFolders = vscode.workspace.workspaceFolders;
      assert.strictEqual(
        wsFolders?.[wsFolders.length - 1].uri.fsPath.toLowerCase(),
        workspace.docsFolder.toLowerCase(),
      );
    });
    test('Install Console++', async function () {
      if (!extension) this.skip();
      const files = [
        {
          src: path.join(extension.extensionPath, 'scripts', 'Console', 'console.lua'),
          dst: path.join(workspace.docsFolder, 'Console', 'console.lua'),
        },
        {
          src: path.join(extension.extensionPath, 'scripts', 'Console', 'console++.lua'),
          dst: path.join(workspace.docsFolder, 'Console', 'console++.lua'),
        },
        {
          src: path.join(extension.extensionPath, 'scripts', 'vscode', 'console.lua'),
          dst: path.join(workspace.docsFolder, 'vscode', 'console.lua'),
        },
      ];

      // Check that Console++ does not exist
      const filesExistBefore = await Promise.allSettled(
        files.map((file) => vscode.workspace.fs.stat(vscode.Uri.file(file.dst))),
      );

      filesExistBefore.forEach((file) => {
        // assert.strictEqual(file.status, 'rejected');
        // If the file exists, test is invalid and should be skipped.
        if (file.status === 'fulfilled') {
          console.warn('Skipping test because Console++ already exists');
          this.skip();
        }
      });

      // Install Console++
      await workspace.installConsole(extension.extensionPath);
      // Check that Console++ was installed
      const filesExistAfter = await Promise.all(
        files.map((file) => vscode.workspace.fs.stat(vscode.Uri.file(file.dst))),
      );
      assert.ok(filesExistAfter.every((file) => file.type === vscode.FileType.File));
    });
  });
});
