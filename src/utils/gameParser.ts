import { ExpandedSaveState, SplitIO } from '@matanlurey/tts-expander';
import * as vscode from 'vscode';
import TTSWorkDir from '../TTSWorkDir';
import { FileManager } from '../vscode/workspace';
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

  // Manipulate modtree to our liking
  modTree.metadata.filePath = getConfig('fileManagement.git.saveName') + '.json';
  if (modTree.luaScript !== undefined) {
    modTree.luaScript.filePath = 'Global.-1.lua';
    modTree.metadata.contents.LuaScript = '#include ./Global.-1.lua';
  }
  if (modTree.xmlUi !== undefined) {
    modTree.xmlUi.filePath = 'Global.-1.xml';
    modTree.metadata.contents.XmlUI = '#include ./Global.-1.xml';
  }
  if (modTree.luaScriptState !== undefined) {
    modTree.luaScriptState.filePath = 'Global.-1.state.json';
    modTree.metadata.contents.LuaScriptState = '#include ./Global.-1.state.json';
  }

  let childrenDir = getConfig<string>('fileManagement.git.childrenDir');
  if (modTree.metadata.contents.SaveName)
    childrenDir = childrenDir.replace('{SaveName}', modTree.metadata.contents.SaveName);

  const outJson = await splitter.writeSplit(output.fsPath, modTree, { childrenDir });
}

export async function collapseGame(metadataPath: string) {
  // Read and parse metadata
  const saveMger = new FileManager(metadataPath, false);
  const save: ExpandedSaveState = JSON.parse(await saveMger.read());
  const splitter = new SplitIO();
  return await splitter.readAndCollapse(metadataPath, {
    childrenDir: getConfig<string>('fileManagement.git.childrenDir').replace(
      '{SaveName}',
      save.Save.SaveName,
    ),
  });
}
