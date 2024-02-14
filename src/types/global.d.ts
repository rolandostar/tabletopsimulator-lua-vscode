export {}

declare global {
  type InGameObjectsList = Record<string, { name?: string, type?: string, iname?: string }>
  export interface GameObject {
    objectProps?: string
    location?: string
    script?: string
    ui?: string
    name: string
    guid: string
  }
  enum autoOpen {
    ALL = 'All',
    GLOBAL = 'Global',
    NONE = 'None'
  }
}
