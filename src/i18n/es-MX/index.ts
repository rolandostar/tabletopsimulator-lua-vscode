import enUS from '../en-US'
import type { Translation } from '../i18n-types'

const { urls } = enUS.docs

const esMX = {
  // this is an example Translation, just rename or delete this folder if you want
  activation: '[TTSLua] Activando extension',
  workDir: {
    hover: `Haz clic para seleccionar el directorio de trabajo de TTSLua [[Más información]](${urls.versionControl})`,
    createFailed: 'Error al crear la carpeta temporal: {0}',
    defaultTag: 'Default',
    noGitReposInWorkspace: 'No se encontraron repositorios git en el espacio de trabajo',
    quickPickPlaceHolder: 'Selecciona un directorio de trabajo para almacenar los scripts de TTS',
    failedToSelect: 'Error al seleccionar el directorio de trabajo, porfavor intenta de nuevo'
  },
  docs: {
    learnMore: 'Ver mas',
    urls
  }
} satisfies Translation

export default esMX
