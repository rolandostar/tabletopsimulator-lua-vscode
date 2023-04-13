import { TableGenerator } from '@utils/tableGen'
import {
  CompletionItem,
  CompletionItemKind, MarkdownString, SnippetString
} from 'vscode'
import type { DownloadedAPI, Member } from './apiManager'

const StringToCompletionKind: Record<string, CompletionItemKind> = {
  function: CompletionItemKind.Function,
  event: CompletionItemKind.Event,
  property: CompletionItemKind.Property,
  constant: CompletionItemKind.Constant
}

function camelToSnake (s: string): string {
  if (s === '') return ''
  const charA = 'A'.charCodeAt(0)
  const charZ = 'Z'.charCodeAt(0)
  let result = s[0].toLowerCase()
  let upperCaseStartIndex = -1
  for (let i = 1; i < s.length; i++) {
    const c = s[i]
    const code = c.charCodeAt(0)
    if (code >= charA && code <= charZ) {
      if (upperCaseStartIndex < 0) upperCaseStartIndex = i
    } else if (upperCaseStartIndex >= 0) {
      result +=
        s.substring(upperCaseStartIndex, i - 1).toLowerCase() +
        '_' +
        s.substring(i - 1, i).toLowerCase() +
        c
      upperCaseStartIndex = -1
    } else {
      result += c
    }
  }
  return result
}

class Behavior {
  public name: string
  public snakedName: string

  constructor (name: string) {
    this.name = name
    this.snakedName = camelToSnake(name)
  }
}

export class LuaCompletion {
  public readonly completionStore = new Map<string, CompletionItem[]>()
  public readonly behaviourStore: Behavior[] = []

  constructor (public api: DownloadedAPI) {
    for (const sectionName in api.sections) {
      if (!this.completionStore.has(sectionName)) this.completionStore.set(sectionName, [])
      this.completionStore.set(sectionName, this.addMembers(api.sections[sectionName]))
      // Segregate General and Specific
      // if ([
      //   '/', 'Component', 'GameObject', 'Material', 'Object', 'ObjectEvents', 'GlobalEvents',
      //   'PlayerInstance', 'PlayerManager'
      // ].includes(sectionName)) {
      //   this.completionStore[sectionName].push(...this.addMembers(api.sections[sectionName]))
      // } else this.addMembers(api.sections[sectionName])
    }

    api.behaviors.forEach(behaviorName => {
      this.behaviourStore.push(new Behavior(behaviorName))
    })
  }

  private addMembers (members: Member[]): CompletionItem[] {
    // Create Storage if it doesn't exist
    const completionItems: CompletionItem[] = []
    for (const member of members) {
      // Initialize variables
      let detailString = '('
      const insertText = new SnippetString(`${member.name}(`)
      const docString = new MarkdownString(`<p>${member.description}</p>`, true)
      docString.isTrusted = true
      docString.supportHtml = true

      // Create parameter table
      if (member.parameters != null) {
        const paramTable = new TableGenerator()
        member.parameters.forEach((parameter, index) => {
          if (index !== 0) {
            detailString += ', '
            insertText.appendText(', ')
          }
          insertText.appendPlaceholder(parameter.name)
          detailString += parameter.name
          paramTable.addRow(parameter.type, parameter.name, parameter.description)
        })
        docString.value += 'Receives parameters:' + paramTable.toString() + '<br />'
      }
      insertText.appendText(')')
      detailString += ')'

      // Create return table
      const returnTable = new TableGenerator()
      if (member.return_table != null) {
        member.return_table.forEach((returnField, index) => {
          returnTable.addRow(returnField.type, returnField.name, returnField.description)
        })
      } else returnTable.addRow(member.type)
      docString.value += 'Returns:' + returnTable.toString()

      // Create Completion Item
      const cItem = new CompletionItem({
        label: member.name,
        description: member.type,
        detail: detailString
      }, StringToCompletionKind[member.kind] ?? CompletionItemKind.Text)
      cItem.insertText = insertText
      cItem.documentation = docString
      docString.value += `<p><a href="${member.url}">Official Documentation $(link-external)</a></p>`

      // Add to respective storage
      completionItems.push(cItem)
    }
    return completionItems
  }
}
