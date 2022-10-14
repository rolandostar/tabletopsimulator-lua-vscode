import * as bundleErr from 'luabundle/errors';
import * as vscode from 'vscode';

import TTSWorkDir from '../TTSWorkDir';
import getConfig from './getConfig';

type BundleSyntaxError = {
  line: number;
  index: number;
  column: number;
};

export async function handleBundleError(err: unknown, scriptFilename: string) {
  if (err instanceof bundleErr.ModuleResolutionError) {
    const selection = await vscode.window.showErrorMessage(
      `Unable to find module "${err.moduleName}" from ${err.parentModuleName}<${err.line}:${err.column}>\n`,
      'Learn More',
      'Enable Debug',
    );

    if (selection === 'Learn More')
      vscode.env.openExternal(
        vscode.Uri.parse('https://tts-vscode.rolandostar.com/support/debuggingModuleResolution'),
      );
    else if (selection === 'Enable Debug') {
      if (!getConfig<boolean>('ttslua.misc.debugSearchPaths')) {
        vscode.workspace
          .getConfiguration('ttslua.misc')
          .update('debugSearchPaths', true, vscode.ConfigurationTarget.Global);
        vscode.commands.executeCommand('workbench.action.toggleDevTools');
        console.log(
          '[TTSLua] Search Paths debug enabled, TTSAdapter window will now output the search paths when attempting to resolve modules.',
        );
      } else {
        vscode.window
          .showInformationMessage('Search Paths debug is already enabled', 'Toggle DevTools')
          .then((selection) => {
            if (selection === 'Toggle DevTools')
              vscode.commands.executeCommand('workbench.action.toggleDevTools');
          });
      }
    }
    return;
  } else if (err instanceof SyntaxError) {
    const e = err as unknown as BundleSyntaxError;
    const option = await vscode.window.showErrorMessage(
      `Syntax Error in ${scriptFilename}${err.message}`,
      'Go to Error',
    );
    if (!option) return;
    await vscode.window.showTextDocument(TTSWorkDir.getFileUri(scriptFilename)),
      {
        selection: new vscode.Range(e.line - 1, e.column, e.line, 0),
      };
    return;
  }
  vscode.window.showErrorMessage(`${scriptFilename}:\n${err}`);
  return;
}

export function handleSavePathMissing() {
  vscode.window.showErrorMessage(
    'Unable to connect to Tabletop Simulator.\n\n' +
      'If the game is running try to reload the save as a workaround.',
    { modal: true },
  );
}

export function handleGameNotRunning() {
  vscode.window.showErrorMessage(
    'Unable to connect to Tabletop Simulator.\n\n' +
      'Check that the game is running and a save has been loaded.',
    { modal: true },
  );
}

export function handleMultipleInstances() {
  vscode.window.showErrorMessage('Another instance of TTSLua or Atom is already running', {
    modal: true,
    detail: 'Please close the other instance and try again.',
  });
}
