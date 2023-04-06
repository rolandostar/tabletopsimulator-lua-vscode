import type { BaseTranslation } from '../i18n-types'

const urls = {
  versionControl: 'https://tts-vscode.rolandostar.com/guides/versionControl'
}

const enUS = {
  activation: '[TTSLua] Activating extension',
  workDir: {
    hover: `Click to select TTSLua working directory [[Learn More]](${urls.versionControl})`,
    createFailed: 'Failed to create temporary folder: {0:string}',
    defaultTag: 'Default',
    noGitReposInWorkspace: 'No git repositories found in workspace',
    quickPickPlaceHolder: 'Select working directory to store TTS scripts',
    failedToSelect: 'Failed to select workspace folder, please try again'
  },
  docs: {
    learnMore: 'Learn More',
    urls
  }
} satisfies BaseTranslation

export default enUS
