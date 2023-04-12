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

export class LuaCompletion {
  public readonly completionStore: Record<string, CompletionItem[]> = {}

  constructor (public api: DownloadedAPI) {
    for (const sectionName in api.sections) {
      // Segregate General and Specific
      if ([
        '/', 'Component', 'GameObject', 'Material', 'Object', 'ObjectEvents', 'GlobalEvents',
        'PlayerInstance', 'PlayerManager'
      ].includes(sectionName)) this.addMembers(sectionName, api.sections[sectionName])
      else this.addMembers('General', api.sections[sectionName])
    }
  }

  private addMembers (name: string, members: Member[]): void {
    // Create Storage if it doesn't exist
    if (this.completionStore[name] === undefined) this.completionStore[name] = []
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
      this.completionStore[name].push(cItem)
    }
  }
}
