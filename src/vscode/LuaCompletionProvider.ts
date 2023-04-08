/* eslint-disable */
import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';

import {
  CompletionItem,
  CompletionItemKind,
  CompletionItemLabel,
  CompletionItemProvider,
  CompletionList,
} from 'vscode';

import axios, {AxiosError} from 'axios';
import LocalStorageService from './LocalStorageService';

import type * as hscopes from './hscopes';
import {TextEncoder} from 'util';
import TTSAdapter from '../TTSAdapter';
import apiJSON from '../TTSApi';

const apiJSONUrl =
  'https://raw.githubusercontent.com/Berserk-Games/atom-tabletopsimulator-lua/master/lib/api.json';

const suggestionTempDir = path.join(os.tmpdir(), 'vscode-decaffeinate-suggestions');

class Behavior {
  public name: string;
  public snakedName: string;

  constructor(name: string) {
    this.name = name;
    this.snakedName = camelToSnake(name);
  }
}

class Member {
  public name: string = '';
  public kind: string = '';
  public type: string = '';
  public description: string = '';
  public url: string = '';
  public parameters?: Parameter[] = [];
  public return_table?: Parameter[] = [];
  public return_table_items?: Parameter[] = [];
}

class Parameter {
  public name: string = '';
  public type: string = '';
  public description?: string = '';
  public parameters?: Parameter[] = [];
}

export default class LuaCompletionProvider implements CompletionItemProvider {
  // Hyper Scopes is an external extension API used to return the scope inside a document
  // It's used instead of vscode-textmate
  // https://marketplace.visualstudio.com/items?itemName=draivin.hscopes
  private _hsExt: vscode.Extension<hscopes.HScopesAPI> =
    vscode.extensions.getExtension<hscopes.HScopesAPI>('draivin.hscopes') ??
    (() => {
      throw new Error('Hyper Scopes extension not found');
    })();
  private _hs: hscopes.HScopesAPI | undefined;

  // Most of the API goes into _generalCompletions, while a few special items are put into their
  // own lists.
  private _generalCompletions = new Map<string, CompletionItem[]>();
  private _rootNames: CompletionItem[] = [];
  private _objectCompletions: CompletionItem[] = [];
  private _objectEventCompletions: CompletionItem[] = [];
  private _globalEventCompletions: CompletionItem[] = [];
  private _playerInstanceCompletions: CompletionItem[] = [];
  private _playerManagerCompletions: CompletionItem[] = [];
  private _componentCompletions: CompletionItem[] = [];
  private _gameObjectCompletions: CompletionItem[] = [];
  private _materialCompletions: CompletionItem[] = [];

  // Behaviors on Objects add extra members to them: for example, a Book has `getPage`
  // When matching after a variable, we'll check its name against the list of behaviors
  // to try and guess if we should suggest those extra members.
  private _behaviors: Behavior[] = [];

  private _parameterFormat: ParameterFormat[] | undefined = undefined;
  private _loadedApiVersion?: ApiVersion;

  constructor() {
    // Restore completion items from stored suggestions at init time
    this.loadCompletionItems(this.getApiJSONString());
  }

  private getApiJSONString(): string {
    const storedJSON = LocalStorageService.getValue('apiJSON') as string;
    if (storedJSON !== undefined) return storedJSON;
    else return apiJSON;
  }

  public async loadCompletionItems(json: string) {
    const api = JSON.parse(json);
    const apiSections = api.sections;

    const versionString: string = api.version;
    if (versionString === undefined) {
      console.error('Error: Could not read `version` in api.json (is api.json malformed?)');
      return;
    }
    this._loadedApiVersion = new ApiVersion(versionString);
    if (this._loadedApiVersion === undefined || !this._loadedApiVersion.valid) {
      console.error('Error: `version` in api.json should be X.Y.Z.W (is api.json malformed?)');
      return;
    }
    console.log('TTS API Version: ' + versionString);

    this.resetApiData();

    for (let i = 0; i < api.behaviors.length; i++) {
      const name = api.behaviors[i];
      this._behaviors.push(new Behavior(name));
    }

    for (const [name, _members] of Object.entries(apiSections)) {
      const members = _members as Object;
      if (name === '/') this.addMembers(this._rootNames, members);
      else if (name === 'Component') this.addMembers(this._componentCompletions, members);
      else if (name === 'GameObject') this.addMembers(this._gameObjectCompletions, members);
      else if (name === 'Material') this.addMembers(this._materialCompletions, members);
      else if (name === 'Object') this.addMembers(this._objectCompletions, members);
      else if (name === 'ObjectEvents') this.addMembers(this._objectEventCompletions, members);
      else if (name === 'GlobalEvents') this.addMembers(this._globalEventCompletions, members);
      else if (name === 'PlayerInstance') this.addMembers(this._playerInstanceCompletions, members);
      else if (name === 'PlayerManager') this.addMembers(this._playerManagerCompletions, members);
      else {
        this._generalCompletions.set(name, []);
        this.addMembers(<CompletionItem[]>this._generalCompletions.get(name), members);
      }
    }
    // In an Object's code you have access to object events AND global events, so:
    this._objectEventCompletions.push(...this._globalEventCompletions);
  }

  public async updateCompletionItems(force = false) {
    const downloaded = await this.downloadApiJSON();
    if (downloaded === undefined) return;

    if (!downloaded.required && !force) {
      vscode.window.showInformationMessage('No update needed');
      return;
    }

    const downloadedAPI = downloaded.content;
    if (downloadedAPI.version === undefined) {
      console.error('Error: Could not read `version` in api.json (is api.json malformed?)');
      return;
    }

    LocalStorageService.setValue('suggestions-meta', {
      lastUpdated: new Date().getTime(),
      providerVersion: downloadedAPI.version,
    });

    const downloadedApiVersion = new ApiVersion(downloadedAPI.version);
    if (!downloadedApiVersion.valid) {
      console.error('Error: `version` in api.json should be X.Y.Z.W (is api.json malformed?)');
      return;
    }

    if (
      this._loadedApiVersion === undefined ||
      downloadedApiVersion.isHigherVersionThan(this._loadedApiVersion)
    ) {
      const downloadedJSON = JSON.stringify(downloadedAPI);
      LocalStorageService.setValue('apiJSON', downloadedJSON);
      this.loadCompletionItems(downloadedJSON);
    }
  }

  private resetApiData() {
    this._generalCompletions.clear();
    this._rootNames.splice(0, this._rootNames.length);
    this._objectCompletions.splice(0, this._objectCompletions.length);
    this._objectEventCompletions.splice(0, this._objectEventCompletions.length);
    this._globalEventCompletions.splice(0, this._globalEventCompletions.length);
    this._playerInstanceCompletions.splice(0, this._playerInstanceCompletions.length);
    this._playerManagerCompletions.splice(0, this._playerManagerCompletions.length);
    this._componentCompletions.splice(0, this._componentCompletions.length);
    this._gameObjectCompletions.splice(0, this._gameObjectCompletions.length);
    this._materialCompletions.splice(0, this._materialCompletions.length);
    this._behaviors.splice(0, this._behaviors.length);
  }

  private makeParameterFormat(): ParameterFormat[] {
    const result: ParameterFormat[] = [];
    let parameterFormat = vscode.workspace
      .getConfiguration('ttslua.autocompletion')
      .get('parameterFormat') as string;

    function bite(s: string): [ParameterFormat, string] {
      const result: ParameterFormat = {textBeforeToken: '', token: ParameterFormatToken.NONE};
      while (s.length >= 4) {
        if (s.startsWith('TYPE')) {
          result.token = ParameterFormatToken.TYPE;
          return [result, s.substring(4)];
        } else if (s.startsWith('Type')) {
          result.token = ParameterFormatToken.Type;
          return [result, s.substring(4)];
        } else if (s.startsWith('type')) {
          result.token = ParameterFormatToken.type;
          return [result, s.substring(4)];
        } else if (s.startsWith('NAME')) {
          result.token = ParameterFormatToken.NAME;
          return [result, s.substring(4)];
        } else if (s.startsWith('Name')) {
          result.token = ParameterFormatToken.Name;
          return [result, s.substring(4)];
        } else if (s.startsWith('name')) {
          result.token = ParameterFormatToken.name;
          return [result, s.substring(4)];
        } else {
          result.textBeforeToken += s[0];
          s = s.substring(1);
        }
      }
      result.textBeforeToken += s;
      return [result, ''];
    }

    let format: ParameterFormat;
    while (parameterFormat) {
      [format, parameterFormat] = bite(parameterFormat);
      result.push(format);
    }
    return result;
  }

  private makeParameterString(index: number, parameter: Parameter): string {
    if (this._parameterFormat === undefined) {
      this._parameterFormat = this.makeParameterFormat();
    }
    if (!this._parameterFormat) return parameter.name; // sensible default if we somehow end up without a format

    let result = '';
    for (const format of this._parameterFormat) {
      result += format.textBeforeToken;
      switch (format.token) {
        case ParameterFormatToken.TYPE:
          result += parameter.type.toUpperCase();
          break;
        case ParameterFormatToken.Type:
          result += snakeToCamel(parameter.type);
          break;
        case ParameterFormatToken.type:
          result += parameter.type.toLowerCase();
          break;
        case ParameterFormatToken.NAME:
          result += parameter.name.toUpperCase();
          break;
        case ParameterFormatToken.Name:
          result += snakeToCamel(parameter.name);
          break;
        case ParameterFormatToken.name:
          result += parameter.name.toLowerCase();
          break;
      }
    }
    return '${' + index + ':' + result + '}';
  }

  private addMembers(destination: CompletionItem[], members: object) {
    for (const _member of Object.values(members)) {
      const member = _member as Member;
      switch (member.kind) {
        case 'function':
          this.addFunction(destination, member);
          break;
        case 'event':
          this.addEvent(destination, member);
          break;
        case 'property':
          this.addProperty(destination, member);
          break;
        case 'constant':
          this.addConstant(destination, member);
          break;
        default:
          console.error(
            'Error: unknown member kind in api.json (is api.json malformed?): ' + member
          );
      }
    }
  }

  private addFunction(destination: CompletionItem[], member: Member) {
    const parameterLabels: string[] = [];
    const parameterSnippets: string[] = [];
    let tableInfoString = '';
    if (member.parameters !== undefined) {
      for (let i = 0; i < member.parameters.length; i++) {
        const parameter = member.parameters[i] as Parameter;
        parameterLabels.push(parameter.type + ' ' + parameter.name);
        parameterSnippets.push(this.makeParameterString(i + 1, parameter));
        if (parameter.parameters !== undefined)
          tableInfoString += makeTableComment(parameter.name + ' is a table', parameter.parameters);
      }
    }
    if (member.return_table !== undefined)
      tableInfoString += makeTableComment('returns table', member.return_table);
    else if (member.return_table_items !== undefined)
      tableInfoString += makeTableComment(
        'returns table of items. item',
        member.return_table_items
      );

    const parameterDisplay = '(' + parameterLabels.join(', ') + ')';
    const completion = completionItem(CompletionItemKind.Function, member, parameterDisplay);
    completion.insertText = new vscode.SnippetString(
      member.name + '(' + parameterSnippets.join(', ') + ')$0'
    );
    destination.push(completion);

    if (tableInfoString) {
      const detailed = completionItem(
        CompletionItemKind.Function,
        member,
        parameterDisplay + '...'
      );
      detailed.insertText = new vscode.SnippetString(
        member.name + '(' + parameterSnippets.join(', ') + ')$0' + tableInfoString
      );
      destination.push(detailed);
    }
  }

  private addEvent(destination: CompletionItem[], member: Member) {
    const completion = completionItem(CompletionItemKind.Event, member);
    const parameterNames: string[] = [];
    let tableInfoString = '';
    if (member.parameters !== undefined) {
      for (let i = 0; i < member.parameters.length; i++) {
        const parameter = member.parameters[i] as Parameter;
        parameterNames.push(parameter.name);
        if (parameter.parameters !== undefined)
          tableInfoString += makeTableComment(parameter.name + ' is a table', parameter.parameters);
      }
    }
    completion.insertText = new vscode.SnippetString(
      member.name + '(' + parameterNames.join(', ') + ')\n\t$0\nend'
    );
    destination.push(completion);

    if (tableInfoString) {
      const detailed = completionItem(CompletionItemKind.Event, member, '...');
      detailed.insertText = new vscode.SnippetString(
        member.name + '(' + parameterNames.join(', ') + ')' + tableInfoString + '\n\t$0\nend'
      );
      destination.push(detailed);
    }
  }

  private addProperty(destination: CompletionItem[], member: Member) {
    const completion = completionItem(CompletionItemKind.Property, member);
    destination.push(completion);
  }

  private addConstant(destination: CompletionItem[], member: Member) {
    const completion = completionItem(CompletionItemKind.Constant, member);
    destination.push(completion);
  }

  private async downloadApiJSON() {
    const sMeta = LocalStorageService.getOrSet<{
      lastUpdate: number;
      providerVersion: string;
    }>('suggestions-meta', {
      lastUpdate: 0,
      providerVersion: '',
    });

    try {
      const providerData = (await axios.get(apiJSONUrl)).data;
      // Compare
      return {
        required: sMeta.providerVersion !== providerData.version,
        content: providerData,
      };
    } catch (e) {
      if (e instanceof AxiosError && e.response) {
        console.error('Error retrieving api.json', e.response.data);
        vscode.window.showErrorMessage("Unable to contact GitHub's API. Please try again later.");
      }
      return undefined;
    }
  }

  public async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Promise<CompletionItem[] | CompletionList> {
    if (this._hs === undefined) this._hs = await this._hsExt.activate();
    const line = document.lineAt(position).text.substring(0, position.character);
    const token = this._hs.getScopeAt(document, position);
    if (token === null) {
      console.error('HyperScope returned undefined token');
      return [];
    }

    // --------------------------------------- Fast Skips ---------------------------------------
    // Skip if we are inside a string or operator
    const skippedScopes = [
      'keyword.operator.lua',
      'string.quoted.double.lua',
      'string.quoted.single.lua',
    ];
    if (skippedScopes.some(v => token.scopes.includes(v))) return [];
    // Short circuit some common lua keywords
    if (line.match(/(^|\s)else$/) || line.match(/(^|\s)elseif$/) || line.match(/(^|\s)end$/))
      return [];
    // If we're in the middle of typing a number then suggest nothing on .
    if (context.triggerCharacter === '.' && token.text.match(/^[0-9]$/)) return [];

    // Syntactic Snippets -----------------------------------------------------------------------

    if (line.endsWith(' do')) return [snippet('do...end', 'do\n\t$0\nend')];
    if (line.endsWith(' repeat')) return [snippet('repeat...until', 'repeat\n\t$0\nuntil $1')];
    if (line.endsWith(' then') && !line.includes('elseif'))
      return [snippet('then...end', 'then\n\t$0\nend')];

    const functionIndex = line.indexOf('function ');
    const parenIndex = line.indexOf('(');
    if (functionIndex >= 0 && parenIndex > 0 && line.endsWith(')')) {
      let name = line.substring(functionIndex + 9, parenIndex).trimStart();
      name =
        name.substring(name.lastIndexOf(' ') + 1) +
        vscode.workspace.getConfiguration('ttslua.autocompletion').get('coroutineSuffix');

      const functionSnippets = [
        snippet('function...end', '\n\t$0\nend', '1st'),
        snippet(
          'function...coroutine...end',
          `\n\tfunction ${name}()\n\t\t\${0}\n\t\treturn 1\n\tend\n\tstartLuaCoroutine(self, '${name}')\nend`
        ),
        snippet(
          'function...coroutine...repeat...end',
          `\n\tfunction ${name}()\n\t\trepeat\n\t\t\t\${0}\n\t\t\tcoroutine.yield(0)\n\t\tuntil \${1}\n\t\treturn 1\n\tend\n\tstartLuaCoroutine(self, '${name}')\nend`
        ),
      ];

      return functionSnippets;
    }

    // -------------------------------------- Tokenization --------------------------------------
    const grammar = await this._hs.getGrammar(token.scopes[0]);
    if (grammar === null) {
      console.error('HyperScope returned undefined grammar');
      return [];
    }

    enum LuaTokenType {
      NONE,
      SCALAR,
      TABLE,
      FUNCTION,
      PERIOD,
    }
    class LuaToken {
      name: string;
      type: LuaTokenType;
      constructor(name: string, type: LuaTokenType) {
        this.name = name;
        this.type = type;
      }
      public isVariable(): boolean {
        return this.type === LuaTokenType.SCALAR || this.type === LuaTokenType.TABLE;
      }
    }
    const nullLuaToken = new LuaToken('', LuaTokenType.NONE);

    const lineTokens = grammar
      .tokenizeLine(line, null)
      .tokens.map(v => line.substring(v.startIndex, v.endIndex));

    let nextLuaTokenType = LuaTokenType.SCALAR;
    let isAssignment = false;

    function biteToken(): LuaToken {
      const result = lineTokens.pop();
      if (result === undefined) return nullLuaToken;
      if (result.endsWith('.')) lineTokens.push(result);
      const resultType = nextLuaTokenType;

      function eatEnclosure(open: string, close: string): string {
        let openCount = 1;
        let token = lineTokens.pop();
        while (token !== undefined) {
          if (token.endsWith(open)) {
            openCount--;
            if (openCount <= 0) return token;
          } else if (token.startsWith(close)) {
            openCount++;
          }
          token = lineTokens.pop();
        }
        return '';
      }

      nextLuaTokenType = LuaTokenType.SCALAR;
      while (lineTokens.length > 0) {
        const lastToken = lineTokens[lineTokens.length - 1];
        if (lastToken.endsWith('.')) {
          lineTokens.pop();
          if (lastToken === '].') {
            nextLuaTokenType = LuaTokenType.TABLE;
            eatEnclosure('[', ']');
          } else if (lastToken === ').') {
            nextLuaTokenType = LuaTokenType.FUNCTION;
            const functionName = eatEnclosure('(', ')');
            if (functionName !== '(' && functionName !== '') {
              lineTokens.push(functionName.substring(0, functionName.length - 1));
            }
            break;
          }
        } else if (lastToken === ']') {
          nextLuaTokenType = LuaTokenType.TABLE;
          lineTokens.pop();
          eatEnclosure('[', ']');
        } else if (lastToken.trim() === '') {
          if (lineTokens[lineTokens.length - 2] === '=') isAssignment = true;
          lineTokens.splice(0, lineTokens.length);
        } else {
          break;
        }
      }

      if (result.endsWith('.')) {
        return new LuaToken('.', LuaTokenType.PERIOD);
      } else if (/^[a-zA-Z0-9_]+$/.test(result)) {
        return new LuaToken(result, resultType);
      } else {
        lineTokens.splice(0, lineTokens.length);
        return nullLuaToken;
      }
    }

    const currentToken = biteToken(); // first bite may be .PERIOD (subsequent bites will not)
    const previousToken = biteToken();
    const previousToken2 = biteToken();

    if (currentToken.type === LuaTokenType.PERIOD && /^[0-9]*$/.test(previousToken.name)) {
      // Typing a number or an isolated '.' so suggest nothing
      return [];
    }

    enum LuaScope {
      SOURCE,
      VARIABLE,
      ENTITY,
      FUNCTION,
      OTHER,
    }

    function luaScopeFromScope(scope: string): LuaScope {
      switch (scope) {
        case 'source.lua':
          return LuaScope.SOURCE;
        case 'variable.other.lua':
          return LuaScope.VARIABLE;
        case 'entity.other.attribute.lua':
          return LuaScope.ENTITY;
        case 'entity.name.function.lua':
          return LuaScope.FUNCTION;
        default:
          return LuaScope.OTHER;
      }
    }
    let pertinentScope = token.scopes[1];
    if (pertinentScope === 'meta.function.lua') pertinentScope = token.scopes[2];
    const luaScope = luaScopeFromScope(pertinentScope);
    if (luaScope === LuaScope.OTHER) return [];

    const completionItems: CompletionItem[] = [];

    if (luaScope === LuaScope.VARIABLE) {
      // Typing a name with no dot
      completionItems.push(...this._rootNames);

      if (isAssignment) {
        // Add labeled getObjectFromGUID after static getObjectFromGUID if appropriate
        const itemIndex = completionItems.findIndex(v =>
          (v.label as CompletionItemLabel).label.startsWith('getObjectFromGUID')
        );
        if (itemIndex >= 0) {
          const id = line.match(/([^\s]+)\s*=[^=]*$/);
          if (id !== null) {
            // Filter non alfanumeric characters from identifier
            const cleanId = id[1].replace(/[^a-zA-Z0-9]/g, '');
            const guidSuffix = vscode.workspace
              .getConfiguration('ttslua.autocompletion')
              .get('guidSuffix') as string;
            // Deep Copy the completion item
            const smartGetObjectFromGUID: CompletionItem = Object.create(
              completionItems[itemIndex]
            );
            // Replace the snippet with the new one
            smartGetObjectFromGUID.label = `getObjectFromGUID(->${cleanId}${guidSuffix})`;
            smartGetObjectFromGUID.insertText = new vscode.SnippetString(
              `getObjectFromGUID($\{0:${cleanId}${guidSuffix}})`
            );
            // Add the new completion item
            completionItems.splice(itemIndex, 0, smartGetObjectFromGUID);
          }
          // Add truly smart getObjectFromGUID which suggests GUIDs from the game
          // const guidCompletionItems: CompletionItem[] = CompletionProvider._guids.map(guid => {
          const igObjs = TTSAdapter.getInstance().getInGameObjects();
          const guidCompletionItems: CompletionItem[] = Object.keys(igObjs).map(guid => {
            const obj = igObjs[guid];
            const name = obj.name || obj.iname || '';
            const completionItem = new CompletionItem(
              name.length > 0 ? `${name} (${guid})` : guid,
              CompletionItemKind.Value
            );
            completionItem.insertText = `'${guid}'`;
            completionItem.detail = obj.type;
            return completionItem;
          });
          completionItems.push(...guidCompletionItems);
        }
      }
      return completionItems;
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
        if (previousToken.name !== 'Action' || previousToken.type !== LuaTokenType.SCALAR)
          return this._playerInstanceCompletions;
      }

      if (previousToken.type === LuaTokenType.SCALAR) {
        if (previousToken.name === 'Player') return this._playerManagerCompletions;
        if (previousToken.name.endsWith('game_object')) return this._gameObjectCompletions;
        if (previousToken.name.endsWith('material')) return this._materialCompletions;
      } else if (previousToken.type === LuaTokenType.TABLE) {
        if (previousToken.name === 'Player') return this._playerInstanceCompletions;
      } else if (previousToken.type === LuaTokenType.FUNCTION) {
        if (previousToken.name === 'getComponent') return this._componentCompletions;
      }

      const generalCompletion = this._generalCompletions.get(previousToken.name);
      if (generalCompletion !== undefined) return generalCompletion;

      // It's not named in the API => treat it as an Object.

      // Before adding the Object completions we'll check if the variable is named something
      // indicating a behavior, and if it is add those completions first.
      for (const behavior of this._behaviors) {
        if (previousToken.name.endsWith(behavior.snakedName)) {
          const completions = this._generalCompletions.get(behavior.name);
          if (completions === undefined) continue;
          // Matching items so add them; copy them so we can set the sortText
          for (const completionItem of completions) {
            const sortedCompletionItem: CompletionItem = Object.assign(completionItem);
            sortedCompletionItem.sortText = '1st';
            completionItems.push(sortedCompletionItem);
          }
          break;
        }
      }
      completionItems.push(...this._objectCompletions);
      return completionItems;
    } else if (luaScope === LuaScope.FUNCTION) {
      // Either writing their own function, or looking for an event, so add the events
      if (document.fileName.endsWith('-1.lua')) return this._globalEventCompletions;
      else return this._objectEventCompletions;
    }
    return [];
  }
}

function completionItem(
  completionItemKind: CompletionItemKind,
  member: Member,
  labelPostfix = ''
): CompletionItem {
  const result = new CompletionItem(
    {label: member.name + labelPostfix, detail: ' ' + member.type, description: member.description},
    completionItemKind
  );
  result.detail = member.description;
  result.documentation = new vscode.MarkdownString(getURL(member.url));
  return result;
}

function snippet(label: string, insert: string, sortText = ''): CompletionItem {
  const result = new CompletionItem(label, CompletionItemKind.Snippet);
  result.insertText = new vscode.SnippetString(insert);
  result.sortText = sortText;
  return result;
}

function getURL(url: string): string {
  if (url.startsWith('/')) return 'https://api.tabletopsimulator.com' + url;
  else return url;
}

function makeTableComment(header: string, parameters: Parameter[]): string {
  let result = '\n\t-- ' + header + ':';
  for (const table_parameter of parameters) {
    if (table_parameter.description)
      result +=
        '\n\t--   ' +
        table_parameter.name.padEnd(26) +
        table_parameter.type.padEnd(9) +
        table_parameter.description;
    else result += '\n\t--   ' + table_parameter.name.padEnd(26) + table_parameter.type;
  }
  return result;
}

function camelToSnake(s: string): string {
  if (s === '') return '';
  const charA = 'A'.charCodeAt(0);
  const charZ = 'Z'.charCodeAt(0);
  let result = s[0].toLowerCase();
  let upperCaseStartIndex = -1;
  for (let i = 1; i < s.length; i++) {
    const c = s[i];
    const code = c.charCodeAt(0);
    if (code >= charA && code <= charZ) {
      if (upperCaseStartIndex < 0) upperCaseStartIndex = i;
    } else if (upperCaseStartIndex >= 0) {
      result +=
        s.substring(upperCaseStartIndex, i - 1).toLowerCase() +
        '_' +
        s.substring(i - 1, i).toLowerCase() +
        c;
      upperCaseStartIndex = -1;
    } else {
      result += c;
    }
  }
  return result;
}

function snakeToCamel(s: string, capitalize = false): string {
  if (s === '') return '';
  let result = capitalize ? s[0].toUpperCase() : s[0];
  let uppercaseNext = false;
  for (let i = 1; i < s.length; i++) {
    const c = s[i];
    if (c === '_') uppercaseNext = true;
    else if (uppercaseNext) {
      result += c.toUpperCase();
      uppercaseNext = false;
    } else result += c;
  }
  return result;
}

enum ParameterFormatToken {
  NONE,
  TYPE,
  Type,
  type,
  NAME,
  Name,
  name,
}

class ParameterFormat {
  textBeforeToken: string = '';
  token: ParameterFormatToken = ParameterFormatToken.NONE;
}

class ApiVersion {
  // The version in api.json is standard semantic versioning plus an additional value for API updates.
  // `major`, `minor`, & `patch` will reflect the version of TTS the api is appropriate for.
  // `api` will be incremented if the api needs updated within a single TTS version.
  major: number;
  minor: number;
  patch: number;
  api: number;
  valid: boolean;

  constructor(versionString: string) {
    const parts: number[] = versionString.split('.').map(Number);
    this.valid = parts.length >= 4;
    this.major = parts[0];
    this.minor = parts[1];
    this.patch = parts[2];
    this.api = parts[3];
  }

  public isHigherVersionThan(other: ApiVersion): boolean {
    if (!this.valid) return false;
    if (this.major > other.major) return true;
    else if (this.major === other.major) {
      if (this.minor > other.minor) return true;
      else if (this.minor === other.minor) {
        if (this.patch > other.patch) return true;
        else if (this.patch === other.patch) {
          return this.api > other.api;
        }
      }
    }
    return false;
  }
}
