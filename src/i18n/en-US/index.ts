import type { BaseTranslation } from '../i18n-types'

const urls = {
  luaCompletionApi: 'https://raw.git.com/Berserk-Games/atom-tabletopsimulator-lua/master/lib/api.json',
  versionControl: 'https://tts-vscode.rolandostar.com/guides/versionControl',
  settings: {
    fileManagement: 'https://tts-vscode.rolandostar.com/extension/configuration#file-management'
  }
}

const enUS = {
  activation: '[TTSLua] Activating extension',
  TTSService: {
    XMLDefaultText: `<!--File automatically generated by VSCode, change this behaviour with "ttslua.fileManagement.createXML" setting-->\n<!--Learn more at ${urls.settings.fileManagement}-->`
  },
  workDir: {
    hover: `Click to select TTSLua working directory [[Learn More]](${urls.versionControl})`,
    createFailed: 'Failed to create temporary folder: {0:string}',
    defaultTag: 'Default',
    noGitReposInWorkspace: 'No git repositories found in workspace',
    quickPickPlaceHolder: 'Select working directory to store TTS scripts',
    failedToSelect: 'Failed to select workspace folder, please try again',
    removed: 'The currently selected working directory is not available in the workspace.\nPlease select a new one or re-add it to the workspace.\n\nDefault working directory will be added when getting scripts. (Ctrl + Alt + L)'
  },
  docs: {
    learnMore: 'Learn More'
  },
  urls,
  errors: {
    uriStatUnexpected: 'Unexpected error while checking if "{0:string}" exists: {1:string}'
  }
} satisfies BaseTranslation

export default enUS
