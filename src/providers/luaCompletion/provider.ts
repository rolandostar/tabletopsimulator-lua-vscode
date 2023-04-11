import getConfig from '@utils/getConfig'
import {
  type CompletionItemProvider, type TextDocument, type Position, type CancellationToken,
  type CompletionContext, CompletionItem, type CompletionList, CompletionItemKind, SnippetString
} from 'vscode'
import { LuaCompletion } from '.'
import * as apiManager from './apiManager'
import { hs } from '..'

function snippet (label: string, insert: string, sortText = ''): CompletionItem {
  const result = new CompletionItem(label, CompletionItemKind.Snippet)
  result.insertText = new SnippetString(insert)
  result.sortText = sortText
  return result
}

export default class LuaCompletionProvider implements CompletionItemProvider {
  private luaCompletion: LuaCompletion | undefined

  public async preload (): Promise<void> {
    const latestApi = await apiManager.loadApi().catch(async err => {
      // Unable to read from disk, let's download it instead
      if (err.code !== 'FileNotFound') throw err
      return await apiManager.downloadApi()
    })
    this.luaCompletion = new LuaCompletion(latestApi)
  }

  public async provideCompletionItems (
    document: TextDocument,
    position: Position,
    _token: CancellationToken,
    context: CompletionContext
  ): Promise<CompletionItem[] | CompletionList> {
    if (!getConfig<boolean>('autocompletion.luaEnabled')) return []
    const line = document.lineAt(position).text.substring(0, position.character)
    const token = hs.getScopeAt(document, position)
    if (token === null) {
      console.error('HyperScope returned undefined token')
      return []
    }

    // --------------------------------------- Fast Skips ---------------------------------------
    // Skip if we are inside a string or operator
    const skippedScopes = [
      'keyword.operator.lua',
      'string.quoted.double.lua',
      'string.quoted.single.lua'
    ]
    if (skippedScopes.some(v => token.scopes.includes(v))) return []

    // Short circuit some common lua keywords
    if (
      (line.match(/(^|\s)else$/) != null) ||
      (line.match(/(^|\s)elseif$/) != null) ||
      (line.match(/(^|\s)end$/) != null)
    ) return []
    // If we're in the middle of typing a number then suggest nothing on .
    if (context.triggerCharacter === '.' && (token.text.match(/^[0-9]$/) != null)) return []

    // Syntactic Snippets -----------------------------------------------------------------------

    if (line.endsWith(' do')) return [snippet('do...end', 'do\n\t$0\nend')]
    if (line.endsWith(' repeat')) return [snippet('repeat...until', 'repeat\n\t$0\nuntil $1')]
    if (line.endsWith(' then') && !line.includes('elseif')) { return [snippet('then...end', 'then\n\t$0\nend')] }

    const functionIndex = line.indexOf('function ')
    const parenIndex = line.indexOf('(')
    if (functionIndex >= 0 && parenIndex > 0 && line.endsWith(')')) {
      let name = line.substring(functionIndex + 9, parenIndex).trimStart()
      name = name.substring(name.lastIndexOf(' ') + 1) + getConfig<string>('autocompletion.coroutineSuffix')

      const functionSnippets = [
        snippet('function...end', '\n\t$0\nend', '1st'),
        snippet(
          'function...coroutine...end',
          `\n\tfunction ${name}()\n\t\t\${0}\n\t\treturn 1\n\tend\n\tstartLuaCoroutine(self, '${name}')\nend`
        ),
        snippet(
          'function...coroutine...repeat...end',
          `\n\tfunction ${name}()\n\t\trepeat\n\t\t\t\${0}\n\t\t\tcoroutine.yield(0)\n\t\tuntil \${1}\n\t\treturn 1\n\tend\n\tstartLuaCoroutine(self, '${name}')\nend`
        )
      ]

      return functionSnippets
    }

    // -------------------------------------- Tokenization --------------------------------------
    const grammar = await hs.getGrammar(token.scopes[0])
    if (grammar === null) {
      console.error('HyperScope returned undefined grammar')
      return []
    }

    const lineTokens = grammar
      .tokenizeLine(line, null)
      .tokens.map(v => line.substring(v.startIndex, v.endIndex))
    console.log(lineTokens)
  }
}
