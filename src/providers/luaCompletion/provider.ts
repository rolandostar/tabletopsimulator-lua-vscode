import getConfig from '@utils/getConfig'
import {
  type CompletionItemProvider, type TextDocument, type Position, type CancellationToken,
  type CompletionContext, CompletionItem, type CompletionList, CompletionItemKind, SnippetString,
  type CompletionItemLabel
} from 'vscode'
import { LuaCompletion } from '.'
import * as apiManager from './apiManager'
import { type LineToken, hs } from '..'

function snippet (label: string, insert: string, sortText = ''): CompletionItem {
  const result = new CompletionItem(label, CompletionItemKind.Snippet)
  result.insertText = new SnippetString(insert)
  result.sortText = sortText
  return result
}

enum LuaTokenType {
  SCALAR,
  TABLE,
  FUNCTION
}

/**
 * This functions aids in the transformation of the tokens returned by the grammar,
 * it will remove tokens that are not relevant to the completion and will add a type
 * property to the remaining tokens.
 * @param lineTokens - The tokens returned by the grammar
 * @returns An array of tokens with the type property
 */
function processLineTokens (lineTokens: LineToken[]): Array<LineToken & { type: number }> {
  type validEnclosures = '[' | '(' | ']' | ')'
  interface enclosureInfo {
    match: validEnclosures
    type: LuaTokenType
    direction: 'open' | 'close'
  }
  // Order matters here, we want to match the closing enclosure first
  const enclosures: Record<validEnclosures, enclosureInfo> = {
    ']': { match: '[', type: LuaTokenType.TABLE, direction: 'close' },
    ')': { match: '(', type: LuaTokenType.FUNCTION, direction: 'close' },
    '[': { match: ']', type: LuaTokenType.TABLE, direction: 'open' },
    '(': { match: ')', type: LuaTokenType.FUNCTION, direction: 'open' }
  }
  const enclosuresFound: string[] = []
  const result: Array<LineToken & { type: number }> = []
  let nextLuaTokenType = LuaTokenType.SCALAR // Default to scalar
  for (const token of lineTokens) {
    // Store initialState to determine if current token must be preserved
    // and the type determined by previus iteration
    const initialState = { preserve: enclosuresFound.length === 0, type: nextLuaTokenType }
    // Reset type of next token to default
    nextLuaTokenType = LuaTokenType.SCALAR
    // Check if any valid enclosure is present in token
    for (const validEnclosure of Object.keys(enclosures) as Array<keyof typeof enclosures>) {
      if (token.value.includes(validEnclosure)) {
        // If so, check if it's an opening or closing enclosure
        if (enclosures[validEnclosure].direction === 'close') {
          // If we find a closing enclosure then we push their match to the stack
          enclosuresFound.push(enclosures[validEnclosure].match)
        } else if (enclosures[validEnclosure].direction === 'open') {
          // If we find an opening enclosure then we pop it from the stack and compare
          const match = enclosuresFound.pop()
          // If comparison goes wrong, we return what we have so far
          if (match === undefined || match !== validEnclosure) return result
          // If goes well, we set the type of the next token
          nextLuaTokenType = enclosures[validEnclosure].type
        }
      }
    }
    // If we were not within an enclosure then we preserve token
    if (initialState.preserve) result.push({ ...token, type: initialState.type })
    // We only need 2 token for the completion to work
    if (result.length === 2) return result
  }
  return result
}

export default class luaCompletionProvider implements CompletionItemProvider {
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
    if (this.luaCompletion === undefined) return []
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
    // Clever! We add an underscore to the end of the line to "peek" at the scope of what comes next
    const lineTokens: LineToken[] = grammar
      .tokenizeLine(line + '_', null)
      .tokens.map(v => {
        return {
          value: (line + '_').substring(v.startIndex, v.endIndex),
          start: v.startIndex,
          end: v.endIndex,
          scopes: v.scopes
        }
      })
      .reverse()
      .filter(v => v.value !== '.' && v.value.trim().length !== 0)
    const [currentToken, previousToken] = processLineTokens(lineTokens).filter(v => !v.value.endsWith('.'))

    // -------------------------------------- Completion ----------------------------------------
    /**
       * Completion of a line falls under one of the 3 following patterns:
       * 1. We are writing something with no other info, we suggest the root (/) completion
       * 2. We are writing something after a dot, we suggest the completion of the previous token
       * 3. We are writing a function, we suggest eventbased completions
       */

    // 1. We started writing at root scope (most code will autocomplete here)
    if (
      context.triggerCharacter !== '.' &&
      currentToken.scopes[1] !== undefined &&
      currentToken.scopes[1] === 'variable.other.lua'
    ) {
      const completionItems: CompletionItem[] = Array.from(this.luaCompletion.completionStore.get('/') ?? [])
      // If there's an assignment, offer getObjectFromGUID with suffix
      if (line.includes('=')) {
        const itemIndex = completionItems.findIndex(v =>
          (v.label as CompletionItemLabel).label.startsWith('getObjectFromGUID')
        )
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
      return completionItems
    }

    // 2. Writing something after a dot
    if (currentToken.scopes[1] === 'entity.other.attribute.lua') {
      console.log('Returning object completion')
      switch (previousToken?.type) {
        case LuaTokenType.SCALAR:
          if (previousToken.value === 'Player') return this.luaCompletion.completionStore.get('PlayerManager') ?? []
          if (previousToken.value.endsWith('game_object')) return this.luaCompletion.completionStore.get('GameObject') ?? []
          if (previousToken.value.endsWith('material')) return this.luaCompletion.completionStore.get('Material') ?? []
          break
        case LuaTokenType.TABLE:
          if (previousToken.value === 'Player') return this.luaCompletion.completionStore.get('PlayerInstance') ?? []
          break
        case LuaTokenType.FUNCTION:
          if (previousToken.value === 'getComponent') return this.luaCompletion.completionStore.get('Component') ?? []
      }

      if (previousToken !== undefined) {
        const specificCompletion = this.luaCompletion.completionStore.get(previousToken.value)
        if (specificCompletion !== undefined) return specificCompletion
      }
      // It's not named in the API => treat it as an Object.
      // Before adding the Object completions we'll check if the variable is named something
      // indicating a behavior, and if it is add those completions first.
      const completionItems: CompletionItem[] = Array.from(this.luaCompletion.completionStore.get('Object') ?? [])
      for (const b of this.luaCompletion.behaviourStore) {
        if (previousToken?.value.toLowerCase().endsWith(b.toLowerCase())) {
          const bCompletions = this.luaCompletion.completionStore.get(b) ?? []
          if (bCompletions === undefined) continue
          // Matching items so add them; copy them so we can set the sortText
          for (const completionItem of bCompletions) {
            const sortedCompletionItem: CompletionItem = Object.assign(completionItem)
            sortedCompletionItem.sortText = '1st'
            completionItems.push(sortedCompletionItem)
          }
          break
        }
      }
      return completionItems
    }

    // 3. Either writing their own function, or looking for an event, so add the events
    if (currentToken.scopes[2] !== undefined && currentToken.scopes[2] === 'entity.name.function.lua') {
      // GlobalEvents already include universal event handlers, so we'll just return them
      if (document.fileName.endsWith('-1.lua')) return this.luaCompletion.completionStore.get('GlobalEvents') ?? []

      // The API does not make a distinction between global and universal events,
      // so we'll define the global events, and calculate the universal events
      // https://api.tabletopsimulator.com/events/#universal-event-handlers-summary
      const globalEventHandlerLabels = ['onZoneGroupSort', 'tryObjectEnterContainer', 'tryObjectRandomize', 'tryObjectRotate']
      const universalEventHandlers = this.luaCompletion.completionStore.get('GlobalEvents')?.filter(v =>
      // GlobalEvents Completion Store minus the global event handlers = universal event handlers
        !globalEventHandlerLabels.includes((v.label as CompletionItemLabel).label)
      )
      if (universalEventHandlers === undefined) throw new Error('Universal Event Handlers are undefined')
      return universalEventHandlers.concat(this.luaCompletion.completionStore.get('ObjectEvents') ?? [])
    }
    return []
  }
}
