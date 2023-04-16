/**
 * @file Import Folder Utility
 * This utility function is used to import all files in a folder.
 * Skip is usually to skip the index file if the index file is the one importing this function.
 *
 * See example in src > TTSService > listeners > index.ts
 */

/**
 * Usage: `importFolder(require.context('./', true, /\.ts$/))`
 *
 * @param require.context's parameters must be statically analyzable (literals)
 * @param skip function to skip files, e.g. `name => name === 'index.ts'`
 *
 * @returns array of imported modules
 */
export default function (
  r: __WebpackModuleApi.RequireContext, skip: (name: string) => boolean = () => true
): any {
  return r.keys().filter(skip).map((key: string) => ({
    file: key.replace(/(\.\/|\.ts)/g, ''),
    content: r(key)
  }))
}
