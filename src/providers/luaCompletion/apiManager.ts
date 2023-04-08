import L from '@/i18n'
import { CompletionItemKind, CompletionItem, SnippetString, MarkdownString } from 'vscode'
import * as LSS from '@utils/LocalStorageService'
import fetch from 'node-fetch'

interface Basic {
  name: string
  type: string
  description?: string
}

interface Section extends Basic {
  description: string
  kind: string
  url: string
}

interface Parameter extends Basic {
  parameters?: Parameter[]
}

interface Member extends Section {
  parameters?: Parameter[]
  return_table?: Parameter[]
  return_table_items?: Parameter[]
}

interface DownloadedAPI {
  sections: Record<string, Section[]>
  version: string
  behaviors: string[]
}

const defaultDownloadedApiPath = 'completion/luaApi.json'

export async function loadApi (): Promise<DownloadedAPI> {
  console.log('Loading API')
  return await LSS.read(defaultDownloadedApiPath).then(async r => JSON.parse(r))
}

export async function downloadApi (): Promise<DownloadedAPI> {
  console.log('Downloading API')
  return await fetch(L.urls.luaCompletionApi()).then(async r => await r.json() as DownloadedAPI)
}

/* ---------------------------------------------------------------------------------------------- */
function makeTableComment (header: string, parameters: Parameter[]): string {
  let result = '\n\t-- ' + header + ':'
  for (const tableParameter of parameters) {
    if (tableParameter.description != null) {
      result +=
        '\n\t--   ' +
        tableParameter.name.padEnd(26) +
        tableParameter.type.padEnd(9) +
        tableParameter.description
    } else result += '\n\t--   ' + tableParameter.name.padEnd(26) + tableParameter.type
  }
  return result
}

function getURL (url: string): string {
  if (url.startsWith('/')) return 'https://api.tabletopsimulator.com' + url
  else return url
}

function completionItem (
  completionItemKind: CompletionItemKind,
  member: Member,
  labelPostfix = ''
): CompletionItem {
  const result = new CompletionItem(
    {
      label: member.name + labelPostfix,
      detail: ' ' + member.type,
      description: member.description
    },
    completionItemKind
  )
  result.detail = member.description
  result.documentation = new MarkdownString(getURL(member.url))
  return result
}

export class LuaCompletion {
  public readonly completionStore: Record<string, CompletionItem[]> = {}

  constructor (public api: DownloadedAPI) {
    for (const sectionName in api.sections) {
      if ([
        'Component', 'GameObject', 'Material', 'Object', 'ObjectEvents', 'GlobalEvents',
        'PlayerInstance', 'PlayerManager', 'WebRequest'
      ].includes(sectionName)) this.addMembers(sectionName, api.sections[sectionName])
      else this.addMembers('General', api.sections[sectionName])
    }
  }

  private addMembers (name: string, members: Member[]): void {
    // set this.completionStore[name] = [] if it doesn't exist
    if (this.completionStore[name] === undefined) this.completionStore[name] = []
    for (const member of members) {
      switch (member.kind) {
        case 'function':
          this.completionStore[name].push(this.addFunction(name, member))
          break
      }
    }
  }

  private addFunction (name: string, section: Member): CompletionItem {
    const parameterLabels = []
    const parameterSnippets = []
    let tableInfoString = ''
    if (section.parameters !== undefined) {
      for (let i = 0; i < section.parameters.length; i++) {
        const parameter = section.parameters[i]
        parameterLabels.push(parameter.type + ' ' + parameter.name)
        parameterSnippets.push(this.makeParameterString(i + 1, parameter))
        if (parameter.parameters !== undefined) { tableInfoString += makeTableComment(parameter.name + ' is a table', parameter.parameters) }
      }
    }
    if (section.return_table !== undefined) {
      tableInfoString += makeTableComment('returns table', section.return_table)
    } else if (section.return_table_items !== undefined) {
      tableInfoString += makeTableComment(
        'returns table of items. item',
        section.return_table_items
      )
    }
    const parameterDisplay = '(' + parameterLabels.join(', ') + ')'
    const completion = completionItem(CompletionItemKind.Function, section, parameterDisplay)
    completion.insertText = new SnippetString(
      section.name + '(' + parameterSnippets.join(', ') + ')$0'
    )
    if (tableInfoString.length > 0) {
      const detailed = completionItem(
        CompletionItemKind.Function,
        section,
        parameterDisplay + '...'
      )
      detailed.insertText = new SnippetString(
        section.name + '(' + parameterSnippets.join(', ') + ')$0' + tableInfoString
      )
      return detailed
    }
    return completion
  }

  private makeParameterString (index: number, parameter: Parameter): string {
    return parameter.name
    // if (this._parameterFormat === undefined) {
    //   this._parameterFormat = this.makeParameterFormat()
    // }
    // if (!this._parameterFormat) return parameter.name // sensible default if we somehow end up without a format

    // let result = ''
    // for (const format of this._parameterFormat) {
    //   result += format.textBeforeToken
    //   switch (format.token) {
    //     case ParameterFormatToken.TYPE:
    //       result += parameter.type.toUpperCase()
    //       break
    //     case ParameterFormatToken.Type:
    //       result += snakeToCamel(parameter.type)
    //       break
    //     case ParameterFormatToken.type:
    //       result += parameter.type.toLowerCase()
    //       break
    //     case ParameterFormatToken.NAME:
    //       result += parameter.name.toUpperCase()
    //       break
    //     case ParameterFormatToken.Name:
    //       result += snakeToCamel(parameter.name)
    //       break
    //     case ParameterFormatToken.name:
    //       result += parameter.name.toLowerCase()
    //       break
    //   }
    // }
    // return '${' + index + ':' + result + '}'
  }
}

// export async function getVersion (): Promise<string> {
//   return loadResult.api.version
// }

// export async function updateAPI (skipSave = false): Promise<{ updated: boolean, semvar: string }> {
//   console.log('Updating API')
//   const latest = skipSave ? loadResult.api : await downloadApi()
//   const updated = loadResulapi.version !== latest.version || skipSave
//   if (updated && !skipSave) await saveApi(latest)
//   return { updated, semvar: latest.version }
// }

// async function saveApi (data: DownloadedAPI): Promise<void> {
//   console.log('Saving API')
//   await LSS.write(defaultDownloadedApiPath, JSON.stringify(data, null, 2))
// }
