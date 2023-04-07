/**
 * Usage: `importFolder(require.context('./', true, /\.ts$/))`
 *
 * require.context parameters must be statically analyzable (literals)
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
