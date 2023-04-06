import { loadAllLocales } from '@/i18n/i18n-util.sync'
import { i18n } from '@/i18n/i18n-util'
import { type TranslationFunctions, type Locales } from './i18n-types'
import getConfig from '@/lib/utils/getConfig'

loadAllLocales()

const locale = getConfig<Locales>('misc.locale')
let L: TranslationFunctions = i18n()[locale]

export async function switchLocale (locale: Locales): Promise<void> {
  L = i18n()[locale]
}

export default L
