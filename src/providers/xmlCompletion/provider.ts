import getConfig from '@/utils/getConfig'
import {
  type CompletionItem, type CompletionList, type Position, type TextDocument,
  type CompletionItemProvider
} from 'vscode'
import { type LineToken, hs } from '..'
import * as LSS from '@/utils/LocalStorageService'
import { FileManager } from '@/vscode/fileManager'
import { join } from 'path'
import { XMLCompletion } from '.'

export default class XMLCompletionProvider implements CompletionItemProvider {
  private xmlCompletion: XMLCompletion | undefined

  public async preload (): Promise<void> {
    const extPath = LSS.get<string>('extensionPath')
    if (extPath === undefined) return
    const apiFs = new FileManager(join(extPath, 'assets/apis/userInterface.json'), false)
    const api = JSON.parse(await apiFs.read())
    this.xmlCompletion = new XMLCompletion(api)
  }

  public async provideCompletionItems (
    document: TextDocument,
    position: Position
  ): Promise<CompletionItem[] | CompletionList<CompletionItem>> {
    if (!getConfig<boolean>('autocompletion.xmlEnabled')) return []

    // const line = document.lineAt(position).text.substring(0, position.character)
    // const range = document.getWordRangeAtPosition(position)
    // const text = document.getText(range)
    /* -------------------------------------- Tokenization -------------------------------------- */
    const grammar = await hs.getGrammar('text.xml')
    if (grammar === null) throw new Error('HyperScope returned undefined grammar')

    let ruleStack = null
    let lineTokens: LineToken[] = []
    for (let i = 0; i <= position.line; i++) {
      const line = i !== position.line
        ? document.lineAt(i).text
        : document.lineAt(i).text.substring(0, position.character) + '_'
      const localTokens = grammar.tokenizeLine(line, ruleStack)
      for (const token of localTokens.tokens) {
        const value = line.substring(token.startIndex, token.endIndex)
        if (value.trim() === '') continue
        lineTokens.push({
          value,
          start: token.startIndex,
          end: token.endIndex,
          scopes: token.scopes
        })
      }
      // console.log(`\nTokenizing line: ${line}`)
      // for (let j = 0; j < lineTokens.tokens.length; j++) {
      //   const token = lineTokens.tokens[j]
      //   console.log(` - token from ${token.startIndex} to ${token.endIndex} ` +
      //         `(${line.substring(token.startIndex, token.endIndex)}) ` +
      //         `with scopes ${token.scopes.join(', ')}`
      //   )
      // }
      ruleStack = localTokens.ruleStack
    }
    lineTokens = lineTokens.reverse()
    const [currentToken] = lineTokens
    if (currentToken.scopes.length === 1) {
      return this.xmlCompletion?.elementStore ?? []
    }

    for (const token of lineTokens) {
      if (token.scopes.includes('entity.name.tag.localname.xml')) {
        return this.xmlCompletion?.attributeStore.get(token.value) ?? []
      }
    }
    return []
  }
}
