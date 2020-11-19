/* eslint-disable no-restricted-syntax */
import * as vscode from 'vscode';
import getScopes from './textmate';
import * as suggestions from './suggestions';

/* class Provider1 implements vscode.CompletionItemProvider {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        // a simple completion item which inserts `Hello World!`
        const simpleCompletion = new vscode.CompletionItem('Hello World!');

        // a completion item that inserts its text as snippet,
        // the `insertText`-property is a `SnippetString` which we will
        // honored by the editor.
        const snippetCompletion = new vscode.CompletionItem('Good part of the day');
        snippetCompletion.insertText = new vscode.SnippetString('Good ${1|morning,afternoon,evening|}. It is ${1}, right?');
        snippetCompletion.documentation = new vscode.MarkdownString('Inserts a snippet that lets you select the _appropriate_ part of the day for your greeting.');

        // a completion item that can be accepted by a commit character,
        // the `commitCharacters`-property is set which means that the completion will
        // be inserted and then the character will be typed.
        const commitCharacterCompletion = new vscode.CompletionItem('console');
        commitCharacterCompletion.commitCharacters = ['.'];
        commitCharacterCompletion.documentation = new vscode.MarkdownString('Press `.` to get `console.`');

        // a completion item that retriggers IntelliSense when being accepted,
        // the `command`-property is set which the editor will execute after
        // completion has been inserted. Also, the `insertText` is set so that
        // a space is inserted after `new`
        const commandCompletion = new vscode.CompletionItem('new');
        commandCompletion.kind = vscode.CompletionItemKind.Keyword;
        commandCompletion.insertText = 'new ';
        commandCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

        // return all completion items as array
        return [
            simpleCompletion,
            snippetCompletion,
            commitCharacterCompletion,
            commandCompletion
        ];
    }
}

class Provider2 implements vscode.CompletionItemProvider {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        // get all text until the `position` and check if it reads `console.`
        // and iff so then complete if `log`, `warn`, and `error`
        let linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.endsWith('console.')) {
            return undefined;
        }

        return [
            new vscode.CompletionItem('log', vscode.CompletionItemKind.Method),
            new vscode.CompletionItem('warn', vscode.CompletionItemKind.Method),
            new vscode.CompletionItem('error', vscode.CompletionItemKind.Method),
        ];
    }
} */

class CompletionProvider implements vscode.CompletionItemProvider {
  private typeToKind: Map<string, vscode.CompletionItemKind> = new Map([
    ['function', vscode.CompletionItemKind.Function],
    ['property', vscode.CompletionItemKind.Property],
    ['constant', vscode.CompletionItemKind.Constant],
  ]);

  async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<vscode.CompletionItem[] | vscode.CompletionList> {
    const line = document.lineAt(position).text.substr(0, position.character);
    const scopes = await getScopes(line, position.character);
    const completionItems = new Array<vscode.CompletionItem>();

    if (['keyword.operator.lua', 'string.quoted.double.lua', 'string.quoted.single.lua'].includes(scopes[1])) {
      return [];
    }

    // TODO: Check if all this can be achieved more easily with builtin textmate
    const {
      tokens, thisToken, thisTokenIntact, previousToken, previousToken2,
    } = CompletionProvider.getTokens(line);

    if ((context.triggerCharacter === '.') && previousToken.match(/^[0-9]$/)) {
      // If we're in the middle of typing a number then suggest nothing on .
      return [];
    } if (line.match(/(^|\s)else$/) || line.match(/(^|\s)elseif$/) || line.match(/(^|\s)end$/) || (line === 'end')) {
      // Short circuit some common lua keywords
      return [];
    }

    const isSection = (sectionName: string): boolean => {
      const isVariableTriggered = (context.triggerCharacter === '.' || scopes[1] === 'variable.other.lua') && previousToken === sectionName;
      const endsWithSection = line.endsWith(`${sectionName}.`);
      const isIntact = previousToken === sectionName && thisTokenIntact;

      return isVariableTriggered || endsWithSection || isIntact;
    };

    const isPlayerSection = (colorSection: boolean): boolean => {
      if (colorSection) {
        return isSection('Player');
      }
      const isVariableTriggered = (context.triggerCharacter === '.' || scopes[1] === 'variable.other.lua') && previousToken2 === 'Player';
      const isPrefixValid = previousToken.substring(0, 7) === 'Player[';

      return isVariableTriggered || isPrefixValid;
    };

    const isObjectSection = (): boolean => context.triggerCharacter === '.' || scopes[1] === 'variable.other.lua' || (tokens.length > 1 && thisTokenIntact);

    const isDefaultEventsSection = (): boolean => line.startsWith('function') && !line.includes('(');

    const isGlobalSection = (): boolean => {
      const endCondition = !(line.endsWith('}') || line.endsWith(')') || line.endsWith(']'));
      return endCondition && !line.includes('function ') && !thisToken.includes('for ') && line.match(/\w$/) !== null;
    };

    if (line.endsWith(' do')) {
      const item = new vscode.CompletionItem('do...end', vscode.CompletionItemKind.Snippet);
      item.insertText = new vscode.SnippetString('do\n\t${1}\nend');
      completionItems.push(item);
    } else if (line.endsWith(' then') && !line.includes('elseif')) {
      const item = new vscode.CompletionItem('then...end', vscode.CompletionItemKind.Snippet);
      item.insertText = new vscode.SnippetString('then\n\t${1}\nend');
      completionItems.push(item);
    } else if (line.endsWith(' repeat')) {
      const item = new vscode.CompletionItem('repeat...until', vscode.CompletionItemKind.Snippet);
      item.insertText = new vscode.SnippetString('repeat\n\t${1}\nuntil ${2}');
      completionItems.push(item);
    } else if (line.includes('function') && line.endsWith(')')) {
      const coroutinePostfix = vscode.workspace.getConfiguration('ttslua').get('coroutinePostfix') as string;

      let funcName = thisToken.substring(0, thisToken.lastIndexOf('('));
      funcName = funcName.substring(funcName.lastIndexOf(' ') + 1);
      funcName += coroutinePostfix;

      const functionItem = new vscode.CompletionItem('function...end', vscode.CompletionItemKind.Snippet);
      functionItem.insertText = new vscode.SnippetString('\n\t${1}\nend');

      const functionCoroutineItem = new vscode.CompletionItem('function...coroutine...end', vscode.CompletionItemKind.Snippet);
      functionCoroutineItem.insertText = new vscode.SnippetString(`\n\tfunction ${funcName}()\n\t\t\${1}\n\t\treturn 1\n\tend\n\tstartLuaCoroutine(self, '${funcName}')\nend`);

      const functionCoroutineRepeatItem = new vscode.CompletionItem('function...coroutine...repeat...end', vscode.CompletionItemKind.Snippet);
      functionCoroutineRepeatItem.insertText = new vscode.SnippetString(`\n\tfunction ${funcName}()\n\t\trepeat\n\t\t\tcoroutine.yield(0)\n\t\tuntil \${1}\n\t\treturn 1\n\tend\n\tstartLuaCoroutine(self, '${funcName}')\nend`);

      completionItems.push(functionItem, functionCoroutineItem, functionCoroutineRepeatItem);
    } else if (isSection('Global')) {
      for (const s of suggestions.getGlobalObjSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('dynamic')) {
      for (const s of suggestions.getDynamicSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('bit32')) {
      for (const s of suggestions.getBit32Suggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('math')) {
      for (const s of suggestions.getMathSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('string')) {
      for (const s of suggestions.getStringSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('table')) {
      for (const s of suggestions.getTableSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('Turns')) {
      for (const s of suggestions.getTurnsSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('UI')) {
      for (const s of suggestions.getUiSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('coroutine')) {
      for (const s of suggestions.getCoroutineSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('os')) {
      for (const s of suggestions.getOsSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('Clock')) {
      for (const s of suggestions.getClockSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('Counter')) {
      for (const s of suggestions.getCounterSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('Lighting')) {
      for (const s of suggestions.getLightingSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('Notes')) {
      for (const s of suggestions.getNotesSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('Physics')) {
      for (const s of suggestions.getPhysicsSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isPlayerSection(false)) {
      for (const s of suggestions.getPlayerColorsSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isPlayerSection(true)) {
      for (const s of suggestions.getPlayerSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('JSON')) {
      for (const s of suggestions.getJsonSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('Time')) {
      for (const s of suggestions.getTimeSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('WebRequest')) {
      for (const s of suggestions.getWebRequestSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('RPGFigurine')) {
      for (const s of suggestions.getRpgFigurineSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('TextTool')) {
      for (const s of suggestions.getTextToolSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isSection('Wait')) {
      for (const s of suggestions.getWaitSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isObjectSection()) {
      for (const s of suggestions.getObjectSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isDefaultEventsSection()) {
      for (const s of suggestions.getDefaultEventsSuggestions(document.fileName.endsWith('-1.lua'))) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    } else if (isGlobalSection()) {
      for (const s of suggestions.getGlobalConstFuncSuggestions()) {
        completionItems.push(this.convertSuggestionToItem(s));
      }
    }

    // Add smart getObjectFromGUID after static getObjectFromGUID if appropriate
    if (thisToken.includes('=')) {
      for (let index = 0; index < completionItems.length; index += 1) {
        const item = completionItems[index];
        if ((item.insertText as vscode.SnippetString).value.startsWith('getObjectFromGUID')) {
          const identifier = line.match(/([^\s]+)\s*=[^=]*$/)![1];
          const guidString = vscode.workspace.getConfiguration('ttslua').get('guidPostfix') as string;

          let insertionPoint = index;
          if (identifier.match(/.*\w$/)) {
            insertionPoint += 1;
            const newSnippet = identifier + guidString;

            completionItems.splice(insertionPoint, 0, this.convertSuggestionToItem({
              snippet: `getObjectFromGUID(${newSnippet})`,
              displayText: `getObjectFromGUID(->${newSnippet})`,
              type: 'function',
              leftLabel: 'Object',
              description: 'Gets a reference to an Object from a GUID. Will return nil if the Object doesn’t exist.',
              descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#getobjectfromguid',
            }));
          }

          for (let i = 0; i < identifier.length; i += 1) {
            const c = identifier[i];

            if (c.match(/[^\w]/)) {
              const pre = identifier.substring(0, i);
              const post = identifier.substring(i);

              if (pre.match(/.*\w$/)) {
                insertionPoint += 1;
                const newSnippet = pre + guidString + post;
                completionItems.splice(insertionPoint, 0, this.convertSuggestionToItem({
                  snippet: `getObjectFromGUID(${newSnippet})`,
                  displayText: `getObjectFromGUID(->${newSnippet})`,
                  type: 'function',
                  leftLabel: 'Object',
                  description: 'Gets a reference to an Object from a GUID. Will return nil if the Object doesn’t exist.',
                  descriptionMoreURL: 'https://api.tabletopsimulator.com/base/#getobjectfromguid',
                }));
              }
            }
          }

          break;
        }
      }
    }

    // Convert function parameters to user desired output
    const matchPattern = /\${([0-9]+):([0-9a-zA-Z_]+)\|([0-9a-zA-Z_]+)}/g;
    const replaceType = vscode.workspace.getConfiguration('ttslua').get('parameterToDisplay') as string;

    let replacePattern: any;
    if (replaceType === 'both') {
      replacePattern = function replace(_match: string, index: number, parameterType: string, parameterName: string) {
        const capitalize = (s: string) => s.substring(0, 1).toUpperCase() + s.substring(1);

        let format = vscode.workspace.getConfiguration('ttslua').get('parameterFormat') as string;
        format = format.replace('TYPE', parameterType.toUpperCase());
        format = format.replace('Type', capitalize(parameterType));
        format = format.replace('type', parameterType);
        format = format.replace('NAME', parameterName.toUpperCase());
        format = format.replace('Name', capitalize(parameterName));
        format = format.replace('name', parameterName);

        return `\${${index}:${format}}`;
      };
    } else {
      const partialPattern: any = {
        type: '$${$1:$2}',
        name: '$${$1:$3}',
        both: '$${$1:$2_$3}',
        none: '$${$1:}',
      };
      replacePattern = partialPattern[replaceType];
    }

    for (const item of completionItems) {
      const newSnippet = (item.insertText as vscode.SnippetString).value.replace(matchPattern, replacePattern);
      item.insertText = new vscode.SnippetString(newSnippet);
    }

    return completionItems;
  }

  // TODO: Check if all this can be achieved more easily with builtin textmate
  private static getTokens(line: string) {
    // Split line into bracket depths
    const depths = new Array<string>();
    let depth = 0;
    let returnedToDepth = false;
    let returningFrom = '';
    // const bracketLookup = { "]": "[]", "}": "{}", ")": "()" };
    const bracketLookup: { [key: string]: any } = { ']': '[]', '}': '{}', ')': '()' };

    depths[depth] = '';

    for (const c of line) {
      if (c.match(/[({[]/)) { // open bracket
        depth += 1;
        if (depth in depths) {
          returnedToDepth = true;
          returningFrom = ' ';
        } else {
          depths[depth] = '';
        }
      } else if (c.match(/[)}\]]/)) { // close bracket
        depth -= 1;
        if (depth in depths) {
          returnedToDepth = true;
          returningFrom = bracketLookup[c];
        } else {
          depths[depth] = '';
        }
      } else {
        if (returnedToDepth) {
          depths[depth] += returningFrom; // indicator of where we just were
          returnedToDepth = false;
        }
        depths[depth] += c;
      }
    }

    depths[depth] += returningFrom;

    // Split relevant depth into tokens
    const tokens = depths[depth].split('.');
    let thisToken = ''; // user is currently typing
    let thisTokenIntact = true; // is it just alphanumerics?
    let previousToken = ''; // last string before a '.'
    let previousToken2 = ''; // ...and the one before that

    if (tokens.length > 0) {
      [thisToken] = tokens.slice(-1);
      if (thisToken.match(/[^a-zA-Z0-9_]+/)) {
        thisTokenIntact = false;
      }
      if (tokens.length > 1) {
        let part: string;
        for (part of tokens.slice(-2)[0].split(/[^a-zA-Z0-9_[\]{}()]+/).reverse()) { // find the last alphanumeric string
          if (part !== '') {
            previousToken = part;
            break;
          }
        }
        if (tokens.length > 2) {
          for (part of tokens.slice(-3)[0].split(/[^a-zA-Z0-9_[\]{}()]+/).reverse()) {
            if (part !== '') {
              previousToken2 = part;
              break;
            }
          }
        }
      }
    }

    return {
      tokens, thisToken, thisTokenIntact, previousToken, previousToken2,
    };
  }

  private convertSuggestionToItem(s: suggestions.Suggestion): vscode.CompletionItem {
    const item = new vscode.CompletionItem(s.displayText.match(/\b.*(?=\()|\b.*$/g)![0]);

    if (this.typeToKind.has(s.type)) {
      item.kind = this.typeToKind.get(s.type);
    } else {
      console.warn(`Unable to map ${s.type} to a kind. Did the atom types change?`);
      item.kind = vscode.CompletionItemKind.Text;
    }

    item.insertText = new vscode.SnippetString(s.snippet);
    item.documentation = new vscode.MarkdownString(`${s.description}\n\n[More](${s.descriptionMoreURL})`);

    if (s.leftLabel) {
      item.detail = `(${s.type}) ${s.leftLabel} ${s.displayText}`;
    } else {
      item.detail = `(${s.type}) ${s.displayText}`;
    }

    return item;
  }

  /* resolveCompletionItem?(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
      throw new Error('Method not implemented.');
  } */
}

export default function activate(context: vscode.ExtensionContext) {
  const completionProvider = vscode.languages.registerCompletionItemProvider({ scheme: '', language: 'lua' }, new CompletionProvider(), '.');

  context.subscriptions.push(completionProvider);
}
