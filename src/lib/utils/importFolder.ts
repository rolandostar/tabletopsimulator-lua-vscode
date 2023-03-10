/**
 * Usage: `importFolder(require.context('./', true, /\.ts$/))`
 * 
 * require.context parameters must be statically analyzable (literals)
 * 
 * @returns array of imported modules
 */

export default function (r: __WebpackModuleApi.RequireContext, skip: (name: string) => boolean = () => true) {
  return r.keys().filter(skip).map(key => ({
    eventname: key.replace(/(\.\/|\.ts)/g, ''),
    callback: r(key).default
  }));
};