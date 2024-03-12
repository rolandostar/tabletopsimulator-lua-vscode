import { TableGenerator } from '@/providers/luaCompletion/TableGenerator'
import {
  CompletionItem,
  CompletionItemKind, MarkdownString, SnippetString
} from 'vscode'
import type { LuaAPI, Member } from './apiManager'

const StringToCompletionKind: Record<string, CompletionItemKind> = {
  function: CompletionItemKind.Function,
  event: CompletionItemKind.Event,
  property: CompletionItemKind.Property,
  constant: CompletionItemKind.Constant
}

export class LuaCompletion {
  public readonly completionStore = new Map<string, CompletionItem[]>()
  public readonly behaviourStore: string[] = []

  constructor (public api: LuaAPI) {
    for (const sectionName in api.sections) {
      // if (!this.completionStore.has(sectionName)) this.completionStore.set(sectionName, [])
      this.completionStore.set(sectionName, this.addMembers(api.sections[sectionName], sectionName))
    }
    this.behaviourStore = api.behaviors
  }

  private addMembers (members: Member[], sectionName: string): CompletionItem[] {
    // Create Storage if it doesn't exist
    const completionItems: CompletionItem[] = []
    for (const member of members) {
      // Initialize variables
      const completionKind = StringToCompletionKind[member.kind] ?? CompletionItemKind.Text
      const funcType =
        completionKind === CompletionItemKind.Function ||
        completionKind === CompletionItemKind.Event
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
      if (completionKind === CompletionItemKind.Event) {
        insertText.appendText(')\n\t').appendTabstop(0).appendText('\nend')
      } else insertText.appendText(')')
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
        detail: funcType ? detailString : undefined
      }, StringToCompletionKind[member.kind] ?? CompletionItemKind.Text)
      cItem.detail = sectionName
      cItem.insertText = funcType ? insertText : member.name
      cItem.documentation = docString
      docString.value += `<p><a href="${member.url}">Official Documentation $(link-external)</a></p>`

      // Add to respective storage
      completionItems.push(cItem)
    }
    return completionItems
  }
}
