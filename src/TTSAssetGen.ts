import * as vscode from 'vscode';
import TTSWorkDir from './vscode/TTSWorkDir';
// import {getApi} from '@microsoft/vscode-file-downloader-api';
import TTS from '@matanlurey/tts-editor';
import Downloader from 'nodejs-file-downloader';
import path from 'path';
import { FileHandler } from './vscode/workspace';
// const {ExternalEditorApi} = require('@rolandostar/tts-editor');

const URLPattern =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

const getGUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
// TODO: Add progress bar
export async function downloadAssets() {
  // Check that we are in a non default workdir
  if (TTSWorkDir.instance.isDefault()) {
    vscode.window.showErrorMessage('You must set a workspace folder before downloading assets');
    return;
  }
  // Read user and repo from input
  const repoUrl = await vscode.window.showInputBox({
    prompt: 'Enter the remote where assets will be stored. Format is `<user>/<repo>/<branch>`',
    validateInput: (value: string) => {
      // Validate that value is in format <user>/<repo>/<branch>
      const parts = value.split('/');
      if (parts.length !== 3) {
        return 'Invalid format. Must be in format <user>/<repo>/<branch>';
      }
      return null;
    },
  });
  if (!repoUrl) return;
  // Extract user and repo from URL
  const [user, repo, branch] = repoUrl.split('/');

  // And the dir contains a savegame
  const saveName = vscode.workspace.getConfiguration('ttslua.fileManagement').get('saveName');
  const saveUri = vscode.Uri.file(TTSWorkDir.instance.getUri().fsPath + '/' + saveName + '.json');
  // stat teh file
  try {
    await vscode.workspace.fs.stat(saveUri);
  } catch (error) {
    vscode.window.showErrorMessage('Could not find savegame');
    return;
  }
  // Scan the savegame for assets, leave placeholders for after download
  const savedata = await TTSWorkDir.instance.readFile(saveName + '.json');
  const toBeDownloaded: { url: string; placeholder: string }[] = [];
  const jsondata = JSON.parse(savedata.toString(), (key, value) => {
    // Check if value matches a URL
    if (typeof value !== 'string' || !value.match(URLPattern)) return value;
    // Check if the URL is a TTS asset
    if (value.includes(`raw.githubusercontent.com/${user}/${repo}/${branch}`)) return value;

    // TODO: Configurable prefix
    const prefix = 'ttslua-';
    const placeholder = prefix + getGUID();
    toBeDownloaded.push({ url: value, placeholder });
    return placeholder;
  });

  // Check toBeDownloaded is not empty
  if (toBeDownloaded.length === 0) {
    vscode.window.showInformationMessage('No assets to download');
    return;
  }

  console.log(`Downloading ${toBeDownloaded.length} assets`);

  // Download the assets
  // Parallel Download seems to create timeouts on large savegames
  // const downloadedFiles = await Promise.allSettled(
  //   toBeDownloaded.map(({url, filename}) =>
  //     new Downloader({
  //       url,
  //       directory: TTSWorkDir.instance.getFileUri('assets').fsPath,
  //       cloneFiles: false,
  //       skipExistingFileName: false,
  //     }).download()
  //   )
  // );

  // Download sequentially
  type DownloaderReport = {
    downloadStatus: 'COMPLETE' | 'ABORTED';
    filePath: string | null;
  };
  const downloadedFiles: PromiseSettledResult<DownloaderReport>[] = [];
  for (const { url } of toBeDownloaded) {
    const dstDirectory = TTSWorkDir.instance.getFileUri('assets').fsPath;
    const dl = new Downloader({
      url,
      maxAttempts: 5, //Default is 1.
      directory: dstDirectory,
      cloneFiles: false,
    });
    try {
      downloadedFiles.push({ status: 'fulfilled', value: await dl.download() });
    } catch (error) {
      downloadedFiles.push({ status: 'rejected', reason: error });
    }
  }

  console.log('Download complete');

  // Todo: Make assets dis configurable
  let stringdata = JSON.stringify(jsondata, null, 2);
  for (const [index, result] of downloadedFiles.entries()) {
    const placeholder = toBeDownloaded[index].placeholder;
    if (
      result.status === 'fulfilled' &&
      // Aborted will be thrown if the file already exists
      result.value.downloadStatus === 'COMPLETE'
    ) {
      stringdata = stringdata.replace(
        placeholder,
        `https://raw.githubusercontent.com/${user}/${repo}/${branch}/assets/${path.basename(
          result.value.filePath!,
        )}`,
      );
    } else stringdata = stringdata.replace(placeholder, toBeDownloaded[index].url);
  }

  // Save Jsondata back to the savegame
  console.log('Saving file');
  const newSavegameFile = new FileHandler(saveName + '_github.json');
  await newSavegameFile.write(stringdata);

  // ⚠️ Send back to game folder ⚠️
  // const savePath = LocalStorageService.getValue('lastSavePath') as string;
  // if (savePath) {
  //   vscode.workspace.fs.copy(
  //     TTSWorkDir.instance.getFileUri(saveName + '.json'),
  //     vscode.Uri.file(path.normalize(savePath)),
  //     {overwrite: true}
  //   );
  // }
}

export async function expander() {
  // Copy Save to a new file
  const api = new TTS();
  const something = await api.executeLuaCodeAndReturn('return "HelloWorld"');
  console.log(something);
}
