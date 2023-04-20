import importFolder from '@/utils/importFolder'
/**
 *  This file exports all other files in this directory making use of the importFolder function.
 */
export default importFolder(
  require.context('./', false, /\.ts$/),
  (name: string) => name !== './index.ts'
) as Array<{
  file: 'getScripts' | 'saveAndPlay'
  content: any & {
    default: (() => void) | (() => Promise<void>)
  }
}>
