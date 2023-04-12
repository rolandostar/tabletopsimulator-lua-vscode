import getConfig from '@utils/getConfig'
import {
  type CompletionItemProvider, type TextDocument, type Position, type CancellationToken,
  type CompletionContext, CompletionItem, type CompletionList, CompletionItemKind, SnippetString, MarkdownString
} from 'vscode'
import { LuaCompletion } from '.'
import * as apiManager from './apiManager'
import { hs } from '..'
import { TableGenerator } from '@/lib/utils/tableGen'

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
      'string.quoted.single.lua',
      'comment.line.double-dash.lua'
    ]
    if (skippedScopes.some(v => token.scopes.includes(v))) return []

    const whitelistedScopes = [
      'source.lua',
      'variable.other.lua',
      'entity.name.function.lua',
      'entity.other.attribute.lua'
    ]
    if (!whitelistedScopes.some(allowedScope =>
      token.scopes[token.scopes[1] === 'meta.function.lua' ? 2 : 1].includes(allowedScope)
    )) return []
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

    // Tokenize line, which pretty much means, split it into words avoiding depth and symbols
    const [currentToken = '', previousToken = '', previousToken2 = ''] = grammar
      .tokenizeLine(line, null)
      .tokens.map(v => line.substring(v.startIndex, v.endIndex))
      // Revers to get tokens from closest to farthest from cursor
      .reverse()
      // Filter out strings ending with dot or where token are only spaces
      .filter(v => !v.endsWith('.') && v.trim().length !== 0)
    const isCurrentTokenAlfanum = /^[a-zA-Z0-9_]+$/.test(currentToken)
    console.log(currentToken, previousToken, previousToken2)
    const myCi = new CompletionItem('myCi', CompletionItemKind.Snippet)
    const table = new TableGenerator()
    table.addRow('RPGFigurine', 'Something')
    table.addRow('int', 'Something')
    table.addRow('string', 'Something')
    table.addRow('function', 'Something')
    table.addRow('bool', 'Something')
    table.addRow('Color', 'Something')
    table.addRow('float', 'Something')
    table.addRow('table', 'Something')
    table.addRow('Object', 'Something')
    table.addRow('any', 'Something')
    table.addRow('int', 'Something')
    table.addRow('Player', 'Something')
    table.addRow('coroutine', 'Something')
    table.addRow('Action', 'Something')
    table.addRow('Vector', 'Something')
    table.addRow('time', 'Something')
    table.addRow('void', 'Something')
    table.addRow('number', 'Something')
    table.addRow('thread', 'Something')
    table.addRow('GameObject', 'Something')
    table.addRow('Component', 'Something')
    table.addRow('captures', 'Something')
    table.addRow('class', 'Something')
    table.addRow('AssetBundle', 'Something')
    table.addRow('Clock', 'Something')
    table.addRow('Counter', 'Something')
    table.addRow('LayoutZone', 'Something')
    table.addRow('RPGFigurine', 'Something')
    table.addRow('int', 'Something')
    table.addRow('TextTool', 'Something')
    const docString = new MarkdownString('', true)
    docString.isTrusted = true
    docString.supportHtml = true
    docString.value += table.toString()
    myCi.documentation = docString
    return [
      ...this.luaCompletion?.completionStore['/'] ?? [],
      ...this.luaCompletion?.completionStore.Component ?? [],
      myCi
    ]
  }
}
