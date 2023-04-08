import enUS from '../en-US'
import { extendDictionary } from '../i18n-util'

const { urls } = enUS

const esMX = extendDictionary(enUS, {
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
    learnMore: 'Ver mas'
  }
})

export default esMX
