import { SplitIO } from '@matanlurey/tts-expander';
import * as vscode from 'vscode';
import TTSWorkDir from '../TTSWorkDir';
import { handleSavePathMissing } from './errorHandling';
import getConfig from './getConfig';
import { uriExists } from './simpleStat';

export async function xtractGame(savePath: string) {
  console.log(savePath);
  if (!savePath) return handleSavePathMissing();
  const output = TTSWorkDir.getFileUri(getConfig('fileManagement.git.output'));
  // Check that output exists
  if (!(await uriExists(output))) vscode.workspace.fs.createDirectory(output);
  const splitter = new SplitIO();
  const modTree = await splitter.readSaveAndSplit(savePath);

  // TODO: Manipulate modTree here

  const outJson = await splitter.writeSplit(output.fsPath, modTree);
  console.log('sup');
}
