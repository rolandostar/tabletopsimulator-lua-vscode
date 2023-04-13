import getConfig from '@utils/getConfig'
import {
  type CompletionItemProvider, type TextDocument, type Position, type CancellationToken,
  type CompletionContext, CompletionItem, type CompletionList, CompletionItemKind, SnippetString,
  type CompletionItemLabel
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
    const skippedScopes = [
      'keyword.operator.lua', // Skip operators
      'string.quoted.double.lua', // Skip strings
      'string.quoted.single.lua', // Skip strings
      'comment.line.double-dash.lua' // Skip comments
    ]
    if (skippedScopes.some(v => token.scopes.includes(v))) return []

    // const whitelistedScopes = [
    //   'source.lua',
    //   'variable.other.lua',
    //   'entity.name.function.lua',
    //   'entity.other.attribute.lua'
    // ]
    // const pertinentScope = token.scopes[token.scopes[1] === 'meta.function.lua' ? 2 : 1]
    // if (!whitelistedScopes.some(allowedScope => pertinentScope.includes(allowedScope))) return []
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

    enum LuaTokenType {
      NONE,
      SCALAR,
      TABLE,
      FUNCTION,
      PERIOD,
    }
    class LuaToken {
      name: string
      type: LuaTokenType
      constructor (name: string, type: LuaTokenType) {
        this.name = name
        this.type = type
      }

      public isVariable (): boolean {
        return this.type === LuaTokenType.SCALAR || this.type === LuaTokenType.TABLE
      }
    }
    const nullLuaToken = new LuaToken('', LuaTokenType.NONE)

    const lineTokens = grammar
      .tokenizeLine(line, null)
      .tokens.map(v => line.substring(v.startIndex, v.endIndex))

    let nextLuaTokenType = LuaTokenType.SCALAR
    let isAssignment = false

    function biteToken (): LuaToken {
      const result = lineTokens.pop()
      if (result === undefined) return nullLuaToken
      if (result.endsWith('.')) lineTokens.push(result)
      const resultType = nextLuaTokenType

      // This function is used to eat the enclosing open and close strings.
      // It takes the open string and close string as parameters.
      // It will then count the number of open strings, and then until the number of open strings equals the number of close strings,
      // it will pop from the lineTokens array and return it.

      function eatEnclosure (open: string, close: string): string {
        let openCount = 1
        let token = lineTokens.pop()
        while (token !== undefined) {
          if (token.endsWith(open)) {
            openCount--
            if (openCount <= 0) return token
          } else if (token.startsWith(close)) {
            openCount++
          }
          token = lineTokens.pop()
        }
        return ''
      }

      nextLuaTokenType = LuaTokenType.SCALAR
      while (lineTokens.length > 0) {
        const lastToken = lineTokens[lineTokens.length - 1]
        if (lastToken.endsWith('.')) {
          lineTokens.pop()
          if (lastToken === '].') {
            nextLuaTokenType = LuaTokenType.TABLE
            eatEnclosure('[', ']')
          } else if (lastToken === ').') {
            nextLuaTokenType = LuaTokenType.FUNCTION
            const functionName = eatEnclosure('(', ')')
            if (functionName !== '(' && functionName !== '') {
              lineTokens.push(functionName.substring(0, functionName.length - 1))
            }
            break
          }
        } else if (lastToken === ']') {
          nextLuaTokenType = LuaTokenType.TABLE
          lineTokens.pop()
          eatEnclosure('[', ']')
        } else if (lastToken.trim() === '') {
          if (lineTokens[lineTokens.length - 2] === '=') isAssignment = true
          lineTokens.splice(0, lineTokens.length)
        } else {
          break
        }
      }

      if (result.endsWith('.')) {
        return new LuaToken('.', LuaTokenType.PERIOD)
      } else if (/^[a-zA-Z0-9_]+$/.test(result)) {
        return new LuaToken(result, resultType)
      } else {
        lineTokens.splice(0, lineTokens.length)
        return nullLuaToken
      }
    }

    const currentToken = biteToken() // first bite may be .PERIOD (subsequent bites will not)
    const previousToken = biteToken()
    const previousToken2 = biteToken()

    if (currentToken.type === LuaTokenType.PERIOD && /^[0-9]*$/.test(previousToken.name)) {
      // Typing a number or an isolated '.' so suggest nothing
      return []
    }

    enum LuaScope {
      SOURCE,
      VARIABLE,
      ENTITY,
      FUNCTION,
      OTHER,
    }

    function luaScopeFromScope (scope: string): LuaScope {
      switch (scope) {
        case 'source.lua':
          return LuaScope.SOURCE
        case 'variable.other.lua':
          return LuaScope.VARIABLE
        case 'entity.other.attribute.lua':
          return LuaScope.ENTITY
        case 'entity.name.function.lua':
          return LuaScope.FUNCTION
        default:
          return LuaScope.OTHER
      }
    }
    let pertinentScope = token.scopes[1]
    if (pertinentScope === 'meta.function.lua') pertinentScope = token.scopes[2]
    const luaScope = luaScopeFromScope(pertinentScope)
    if (luaScope === LuaScope.OTHER) return []

    let completionItems: CompletionItem[] = []

    if (luaScope === LuaScope.VARIABLE) {
      // Typing a name with no dot
      completionItems = completionItems.concat(this.luaCompletion?.completionStore.get('/') ?? [])

      if (isAssignment) {
        // Add labeled getObjectFromGUID after static getObjectFromGUID if appropriate
        const itemIndex = completionItems.findIndex(v =>
          (v.label as CompletionItemLabel).label.startsWith('getObjectFromGUID')
        )
        if (itemIndex >= 0) {
          const id = line.match(/([^\s]+)\s*=[^=]*$/)
          if (id !== null) {
            // Filter non alfanumeric characters from identifier
            const cleanId = id[1].replace(/[^a-zA-Z0-9]/g, '')
            const guidSuffix = getConfig<string>('autocompletion.guidSuffix')
            // Deep Copy the completion item
            const smartGetObjectFromGUID: CompletionItem = Object.create(
              completionItems[itemIndex]
            )
            // Replace the snippet with the new one
            smartGetObjectFromGUID.label = `getObjectFromGUID(->${cleanId}${guidSuffix})`
            smartGetObjectFromGUID.insertText = new SnippetString(
              `getObjectFromGUID($\{0:${cleanId}${guidSuffix}})`
            )
            // Add the new completion item
            completionItems.splice(itemIndex, 0, smartGetObjectFromGUID)
          }
          // Add truly smart getObjectFromGUID which suggests GUIDs from the game
          // const guidCompletionItems: CompletionItem[] = CompletionProvider._guids.map(guid => {
          // TODO: Reenable
          // const igObjs = TTSAdapter.getInstance().getInGameObjects()
          // const guidCompletionItems: CompletionItem[] = Object.keys(igObjs).map(guid => {
          //   const obj = igObjs[guid]
          //   const name = obj.name || obj.iname || ''
          //   const completionItem = new CompletionItem(
          //     name.length > 0 ? `${name} (${guid})` : guid,
          //     CompletionItemKind.Value
          //   )
          //   completionItem.insertText = `'${guid}'`
          //   completionItem.detail = obj.type
          //   return completionItem
          // })
          // completionItems.push(...guidCompletionItems)
        }
      }
      return completionItems
    }

    if (
      luaScope === LuaScope.ENTITY ||
      (luaScope === LuaScope.SOURCE &&
        currentToken.type === LuaTokenType.PERIOD &&
        previousToken.type !== LuaTokenType.NONE)
    ) {
      // Typing a name after a dot
      if (previousToken2.name === 'Player' && previousToken2.type === LuaTokenType.SCALAR) {
        // If it's Player.Action then it will be handled via _generalCompletions below.
        // Otherwise: Action is the only non-color member, so we'll treat it as a
        // PlayerInstance. Note that this logic needs to be updated if Player ever has another
        // non-color member.
        if (previousToken.name !== 'Action' || previousToken.type !== LuaTokenType.SCALAR) { return this.luaCompletion?.completionStore.get('PlayerInstance') ?? [] }
      }

      if (previousToken.type === LuaTokenType.SCALAR) {
        if (previousToken.name === 'Player') return this.luaCompletion?.completionStore.get('PlayerManager') ?? []
        if (previousToken.name.endsWith('game_object')) return this.luaCompletion?.completionStore.get('GameObject') ?? []
        if (previousToken.name.endsWith('material')) return this.luaCompletion?.completionStore.get('Material') ?? []
      } else if (previousToken.type === LuaTokenType.TABLE) {
        if (previousToken.name === 'Player') return this.luaCompletion?.completionStore.get('PlayerInstance') ?? []
      } else if (previousToken.type === LuaTokenType.FUNCTION) {
        if (previousToken.name === 'getComponent') return this.luaCompletion?.completionStore.get('Component') ?? []
      }
      if (previousToken.name !== undefined) {
        const generalCompletion = this.luaCompletion?.completionStore.get(previousToken.name)
        if (generalCompletion !== undefined) return generalCompletion
      }

      // It's not named in the API => treat it as an Object.

      // Before adding the Object completions we'll check if the variable is named something
      // indicating a behavior, and if it is add those completions first.
      for (const behavior of this.luaCompletion?.behaviourStore ?? []) {
        if (previousToken.name.endsWith(behavior.snakedName)) {
          const completions = this.luaCompletion?.completionStore.get(behavior.name)
          if (completions === undefined) continue
          // Matching items so add them; copy them so we can set the sortText
          for (const completionItem of completions) {
            const sortedCompletionItem: CompletionItem = Object.assign(completionItem)
            sortedCompletionItem.sortText = '1st'
            completionItems.push(sortedCompletionItem)
          }
          break
        }
      }
      completionItems.push(...this.luaCompletion?.completionStore.get('Object') ?? [])
      return completionItems
    } else if (luaScope === LuaScope.FUNCTION) {
      // Either writing their own function, or looking for an event, so add the events
      if (document.fileName.endsWith('-1.lua')) return this.luaCompletion?.completionStore.get('GlobalEvents') ?? []
      else return this.luaCompletion?.completionStore.get('ObjectEvents') ?? []
    }
    return []
  }
}
