import * as vscode from 'vscode';
import * as path from 'path';
import * as glob from 'glob';
import * as os from 'os';
import * as decaf from 'decaffeinate';

import axios, {AxiosError} from 'axios';
import LocalStorageService from './LocalStorageService';

import type * as hscopes from './hscopes';
import {TextEncoder} from 'util';
import TTSAdapter from '../TTSAdapter';

const suggestionTempDir = path.join(os.tmpdir(), 'vscode-decaffeinate-suggestions');

/* --- Section Categorization Logic ---
 * Standard autocompletes are built in a Map<sectionName, trigger> format. `trigger` will be the
 * previousToken required to suggest it, while `sectionName` is the name of the section to suggest
 * according to the `provider.coffee` section header.
 *
 * These categories are known categories, when downloading an update to the API, unknown sections
 * will be placed in the "Standard" category. Offering a guess for the trigger, in the form of the
 * lowercase section header name without spaces as well as warning on the console.
 *
 * If special conditions are needed to determine the category auto-completion requirements, a
 * function can be added to the Function Definitions below, and that section can be then added to
 * the extraSectionMatcher object, thus ensuring that that section will not be offered as a
 * standard autocomplete.
 */

const stdSectionMatcher = new Map([
  ['globalobject', 'Global'],
  ['dynamic', 'dynamic'],
  ['bit32', 'bit32'],
  ['math', 'math'],
  ['string', 'string'],
  ['table', 'table'],
  ['turns', 'Turns'],
  ['ui', 'UI'],
  ['coroutine', 'coroutine'],
  ['os', 'os'],
  ['clock', 'Clock'],
  ['counter', 'Counter'],
  ['lighting', 'Lighting'],
  ['notes', 'Notes'],
  ['physics', 'Physics'],
  ['json', 'JSON'],
  ['time', 'Time'],
  ['webrequest', 'WebRequest'],
  ['rpgfigurine', 'RPGFigurine'],
  ['texttool', 'TextTool'],
  ['wait', 'Wait'],
  // Rolandostar's Mappings
  ['musicplayer', 'MusicPlayer'],
  ['vector', 'Vector'],
  ['layoutzonebehaviour', 'LayoutZone'],
  ['zonebehaviourhasallzonemembers', 'Zone'],
  ['color', 'Color'],
  ['playercolors', 'Player'],
]);

// All of these are handled manually after the standard section matcher
const extraSectionMatcher = [
  'player',
  'object',
  'defaultevents-global',
  'defaultevents',
  'globallyaccessibleconstantsfunctions',
];

type SuggestionList = {[key: string]: Suggestion[]};

interface Suggestion {
  snippet: string;
  displayText: string;
  type: string;
  leftLabel: string;
  description: string;
  descriptionMoreURL: string;
}

export default class LuaCompletionProvider implements vscode.CompletionItemProvider {
  // Hyper Scopes is an external extension API used to return the scope inside a document
  // It's used instead of vscode-textmate
  // https://marketplace.visualstudio.com/items?itemName=draivin.hscopes
  private _hsExt: vscode.Extension<hscopes.HScopesAPI> =
    vscode.extensions.getExtension<hscopes.HScopesAPI>('draivin.hscopes') ??
    (() => {
      throw new Error('Hyper Scopes extension not found');
    })();
  private _hs: hscopes.HScopesAPI | undefined;

  // Standard Sections are resolved by the `isSection` function and uses the SectionMatcher map
  private _extraSectionCItems: {[key: string]: vscode.CompletionItem[]} = {};
  private _stdSectionCItems: {[key: string]: vscode.CompletionItem[]} = {};
  // This is dictionary with simple completions that don't require any parsing
  private _cDict: {[key: string]: vscode.CompletionItem} = {};

  constructor() {
    // Restore completion items from stored suggestions at init time
    if (LocalStorageService.getValue('suggestionList')) {
      this.loadCompletionItems();
    } else {
      this.updateCompletionItems();
    }
    // Make sure suggestionTempDir exists, if not, create it
    const suggestionTempDirUri = vscode.Uri.file(suggestionTempDir);
    vscode.workspace.fs.stat(suggestionTempDirUri).then(stats => {
      if (stats.type !== vscode.FileType.Directory) {
        vscode.workspace.fs.createDirectory(suggestionTempDirUri);
      }
    });

    /* ----------------------------- Completion Dictionary Populate ----------------------------- */
    // This is precalculated at init time to avoid having to do it every time a completion is requested
    for (const item of [
      {name: 'endsWithDo', label: 'do...end', snippet: 'do\n\t${0}\nend'},
      {name: 'endsWithThen', label: 'then...end', snippet: 'then\n\t${0}\nend'},
      {name: 'endsWithRepeat', label: 'repeat...until', snippet: 'repeat\n\t${1}\nuntil ${0}'},
      {name: 'fend', label: 'function...end', snippet: '\n\t${0}\nend'},
      {name: 'require', label: 'require("...")', snippet: 'require("${0}")'},
      {name: 'rConsole', label: 'require("vscode/console")', snippet: 'require("vscode/console")'},
    ]) {
      const completionItem = new vscode.CompletionItem(
        item.label,
        vscode.CompletionItemKind.Snippet
      );
      completionItem.insertText = new vscode.SnippetString(item.snippet);
      this._cDict[item.name] = completionItem;
    }
  }

  public async loadCompletionItems() {
    const suggestionList = LocalStorageService.getValue('suggestionList') as SuggestionList;
    // Type <-> Kind
    const typeToKind: Map<string, vscode.CompletionItemKind> = new Map([
      ['function', vscode.CompletionItemKind.Function],
      ['property', vscode.CompletionItemKind.Property],
      ['constant', vscode.CompletionItemKind.Constant],
    ]);

    // Pre-Convert suggestions to completionItems
    const insertTextMatchPattern = /\${([0-9]+):([0-9a-zA-Z_]+)\|([0-9a-zA-Z_]+)}/g;
    Object.entries(suggestionList).forEach(([section, suggestionArray]) => {
      const convertSuggestion = (sArray: Suggestion[]) => {
        return sArray.map(s => {
          // Null coalescing operator to handle non-matching values
          const displayText = s.displayText.match(/\b.*(?=\()|\b.*$/g) ?? [s.displayText];
          const item = new vscode.CompletionItem(displayText[0], typeToKind.get(s.type));
          item.insertText = new vscode.SnippetString(
            // TODO: Implement replace types
            // https://github.com/OliPro007/vscode-tabletopsimulator-lua/blob/master/src/language/completion.ts#L308
            s.snippet.replace(insertTextMatchPattern, '$${$1:$3}')
          );
          item.documentation = new vscode.MarkdownString(
            `${s.description}\n\n[[More Info]](${s.descriptionMoreURL})\n\n*Section: ${section}*`
          );
          item.detail = s.leftLabel
            ? `(${s.type}) ${s.leftLabel} ${s.displayText}`
            : `(${s.type}) ${s.displayText}`;

          return item;
        });
      };

      // Categorize sections
      // If the section is not the extraSectionMatcher array, it's a standard section
      if (!extraSectionMatcher.includes(section)) {
        this._stdSectionCItems[section] = convertSuggestion(suggestionArray);
        return;
      } else this._extraSectionCItems[section] = convertSuggestion(suggestionArray);
    });

    // Check for unhanded sections
    const unhandledSections = Object.keys(suggestionList).filter(
      section => !extraSectionMatcher.includes(section) && !stdSectionMatcher.has(section)
    );
    if (unhandledSections.length > 0) {
      console.warn('Unhandled Sections:', unhandledSections);
      vscode.window
        .showWarningMessage(
          "Unhandled Sections for AutoComplete.\nPlease report this to the extension author if it hasn't already.",
          'Check Issue Tracker',
          'Create Issue'
        )
        .then(selection => {
          switch (selection) {
            case 'Check Issue Tracker':
              vscode.env.openExternal(
                vscode.Uri.parse(
                  'https://github.com/rolandostar/tabletopsimulator-lua-vscode/issues?q=is%3Aissue+is%3Aopen+Unhandled+Sections+for+AutoComplete'
                )
              );
              break;
            case 'Create Issue':
              vscode.env.openExternal(
                vscode.Uri.parse(
                  'https://github.com/rolandostar/tabletopsimulator-lua-vscode/issues/new?title=Unhandled%20Sections%20for%20AutoComplete&body=%2F%2F%20PLEASE%20DO%20NOT%20SUBMIT%20WITHOUT%20SEARCHING%20-%20Help%20me%20prevent%20duplicates.%0A%0ADetected%20Unhandled%20Sections%3A%20%5B%5D&assignee=rolandostar'
                )
              );
              break;
          }
        });
    }
  }

  public async updateCompletionItems(force = false) {
    const updateStatus = await this._needsUpdate();
    // If updateStatus is undefined, there was an error, it's handled internally
    if (updateStatus === undefined) return;
    // If update is not needed, let the user know
    if (!updateStatus.required && !force) {
      vscode.window.showInformationMessage('No update needed');
      return;
    }
    // Content is encoded in base64, decode
    const providerCode = Buffer.from(updateStatus.content, 'base64').toString('utf8');
    // Split provider code
    const splitted = providerCode
      .substring(providerCode.indexOf('# Section: '), providerCode.indexOf('# End of sections'))
      .split('# Section: ');
    splitted.shift(); // Remove empty string at the beginning
    // Make sure the directory is empty before we begin
    await vscode.workspace.fs
      .readDirectory(vscode.Uri.file(suggestionTempDir))
      .then(files =>
        files.map(file =>
          vscode.workspace.fs.delete(vscode.Uri.file(path.join(suggestionTempDir, file[0])))
        )
      );
    /* -------------------------- Suggestion Generation Heavy Lifting ------------------------- */
    // We'll report progress every time a section is parsed
    // First we calculate values to update progress
    const incrementValue = Math.floor(100 / splitted.length);
    // Since API it's discrete we will have a remainder when doing division
    const lastValue = 100 - incrementValue * splitted.length;
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Updating API Intellisense',
        cancellable: false,
      },
      async progress => {
        // Create an array of promises, each resolving when the corresponding section is done
        // This also allows for each section to be parsed in parallel
        // Being asyncronous also allows for the progress bar to update correctly 😊
        await new Promise(resolve => setTimeout(resolve, 0)); // Force progress bar to show initially
        await Promise.all(
          splitted.map(section =>
            // We wrap the progress report function which will update the progress bar as done()
            LuaCompletionProvider._parseSection(section, () =>
              progress.report({increment: incrementValue})
            )
          )
        );

        /* ------------------------------------------------------------------------------------------ */
        // We now have all the updated suggestions on disk, let's import them
        const suggestionList: SuggestionList = {};
        const files = glob.sync('**/*.js', {cwd: suggestionTempDir});
        await Promise.all(
          files.map(async file => {
            const f: (...args: any[]) => Suggestion[] = await import(
              path.join(suggestionTempDir, file)
            );
            const name = path.basename(file, '.js');
            if (name === 'defaultevents') suggestionList['defaultevents-global'] = f(true);

            suggestionList[name] = f();
          })
        );

        // Store suggestion list metadata in memento
        LocalStorageService.setValue('suggestionList', suggestionList);
        LocalStorageService.setValue('suggestions-meta', {
          lastUpdated: new Date().getTime(),
          providerHash: updateStatus.providerHash,
        });
        this.loadCompletionItems();

        // Let the user know that the update is done
        progress.report({
          increment: lastValue,
          message: ': Done!',
        });
        // Simple 300ms delay to make sure the progress bar is shown at 100% for a bit
        return new Promise(resolve => setTimeout(resolve, 2300));
      }
    );
  }

  private async _needsUpdate() {
    // Retrieve stored hash
    const sMeta = LocalStorageService.getOrSet<{
      lastUpdate: number;
      providerHash: string;
    }>('suggestions-meta', {
      lastUpdate: 0,
      providerHash: '',
    });
    // Download provider hash
    try {
      const providerData: {sha: string; content: string} = (
        await axios.get(
          'https://api.github.com/repos/Berserk-Games/atom-tabletopsimulator-lua/contents/lib/provider.coffee'
        )
      ).data; // TODO: Correct events url
      // Compare
      return {
        required: sMeta.providerHash !== providerData.sha,
        providerHash: providerData.sha,
        content: providerData.content,
      };
    } catch (e) {
      if (e instanceof AxiosError && e.response) {
        console.error('Error retrieving provider.coffee hash', e.response.data);
        vscode.window.showErrorMessage("Unable to contact GitHub's API. Please try again later.");
      }
      return undefined;
    }
  }

  private static async _parseSection(section: string, done: () => void) {
    const sectionLines = section.split('\n');
    // Make sure array is not empty
    if (sectionLines.length === 0) return;
    // First line is the section name
    const sectionName = sectionLines.shift() as string;
    // Remove lines until we find the suggestion assignment
    while (sectionLines.length > 0 && !sectionLines[0].trimStart().startsWith('suggestions =')) {
      sectionLines.shift();
    }

    let coffeeScript = '';

    // Control Blocks Section is skipped
    if (sectionName === 'Control blocks') {
      // This section is implemented in _cDict
      done();
      return;
    }

    // Default Events has a different format
    if (sectionName === 'Default Events') {
      coffeeScript =
        'module.exports = (global_script) ->\n' +
        // Remove first 6 space characters to leave a 2 space indent for the function block
        sectionLines.map(v => v.substring(6).replace('\r', '')).join('\n') +
        '\n  return suggestions';
    } else {
      // All other sections can be solved with an indent map
      // This map means, "Lines which start with...
      const indentMap = [
        {pattern: /^[}{]/, indent: 1}, // opening/closing curly braces have lv1 indent
        {pattern: /^'/, indent: 3}, // single quote has lv3 indent
        {pattern: /^\]/, indent: 0}, // closing bracket has lv0 indent
        {pattern: /^suggestions = \[/, indent: 0},
        {pattern: /^[a-zA-Z]/, indent: 2}, // all other lines have lv2 indent
      ];

      // Create new file with appropiate indentation levels
      coffeeScript =
        'module.exports = () ->\n' +
        sectionLines
          .map(v => {
            let indent = 0;
            v = v.trimStart().replace('\r', '');
            for (const {pattern, indent: newIndent} of indentMap) {
              if (pattern.test(v)) {
                // We add +1 because everything is inside a getSuggestions function
                indent = newIndent + 1;
                break;
              }
            }
            return `${'  '.repeat(indent)}${v}`;
          })
          .join('\n') +
        '\n  return suggestions';
    }
    // Formatting is done, time to decaf
    // Section Name is formatted here, because it will be used to match with isSection function
    const exportPath = path.join(
      suggestionTempDir,
      sectionName
        .replace('Class', '')
        .replace(/[^a-zA-Z0-9]/g, '')
        .toLowerCase()
    );
    try {
      const jsCode = decaf.convert(coffeeScript, {loose: true}).code;
      await vscode.workspace.fs.writeFile(
        vscode.Uri.file(exportPath + '.js'),
        new TextEncoder().encode(jsCode)
      );
    } catch (e) {
      if (e instanceof Error) {
        console.error(`Error parsing section: ${sectionName}`);
        console.error(e.message);
        await vscode.workspace.fs.writeFile(
          vscode.Uri.file(exportPath + '.coffee'),
          new TextEncoder().encode(coffeeScript)
        );
        console.warn(`Debug File: ${exportPath}.coffee`);
      }
    }
    // console.log(`Section parsed: '${sectionName}'`);
    done();
    /* --------- Simulates Long running task --------- */
    // await new Promise<void>(resolve => {
    //   setTimeout(() => {
    //     resolve();
    //   }, 1000 * getRandomInt(1, 5));
    // });
    /* ----------------------------------------------- */
  }

  public async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[] | vscode.CompletionList> {
    if (this._hs === undefined) this._hs = await this._hsExt.activate();
    const line = document.lineAt(position).text.substring(0, position.character);
    const token = this._hs.getScopeAt(document, position);
    if (token === null) {
      console.error('HyperScope returned undefined token');
      return [];
    }

    /* --------------------------------------- Fast Skips --------------------------------------- */
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

    /* -------------------------------------- Tokenization -------------------------------------- */
    const grammar = await this._hs.getGrammar(token.scopes[0]);
    if (grammar === null) {
      console.error('HyperScope returned undefined grammar');
      return [];
    }
    // Tokenize line, which pretty much means, split it into words avoiding depth and symbols
    const [currentToken = '', previousToken = '', previousToken2 = ''] = grammar
      .tokenizeLine(line, null)
      .tokens.map(v => line.substring(v.startIndex, v.endIndex))
      // Revers to get tokens from closest to farthest from cursor
      .reverse()
      // Filter out strings ending with dot or where token are only spaces
      .filter(v => !v.endsWith('.') && v.trim().length !== 0);
    const isCurrentTokenAlfanum = /^[a-zA-Z0-9_]+$/.test(currentToken);

    /* ---------------------------------- Function Definitions ---------------------------------- */
    // Functions are defined at completion time to make use of the tokenized lines
    const isSection = (sectionName: string): boolean => {
      const isVariableTriggered =
        (context.triggerCharacter === '.' || token.scopes[1] === 'variable.other.lua') &&
        currentToken === sectionName;
      const endsWithSection = line.endsWith(`${sectionName}.`);
      const isIntact = currentToken === sectionName && isCurrentTokenAlfanum;
      return isVariableTriggered || endsWithSection || isIntact;
    };
    const isPlayerSection = (): boolean => {
      const isVariableTriggered =
        (context.triggerCharacter === '.' || token.scopes[1] === 'variable.other.lua') &&
        previousToken === 'Player';
      const isPrefixValid = previousToken2.substring(0, 7) === 'Player';
      return isVariableTriggered || isPrefixValid;
    };
    const isObjectSection = (): boolean => {
      return (
        context.triggerCharacter === '.' ||
        token.scopes[1] === 'variable.other.lua' ||
        (previousToken !== '' && isCurrentTokenAlfanum)
      );
    };
    const isDefaultEventsSection = (): boolean => {
      return line.startsWith('function') && !line.includes('(');
    };
    const isGlobalSection = (): boolean => {
      const endCondition = !(
        line.trimEnd().endsWith('}') ||
        line.trimEnd().endsWith(')') ||
        line.trimEnd().endsWith(']')
      );
      return (
        endCondition &&
        !line.includes('function ') &&
        !currentToken.includes('for ') &&
        line.match(/\w$/) !== null
      );
    };
    const isGetObjectFromGUID = (): boolean => {
      return (
        (previousToken === '(' && previousToken2 === 'getObjectFromGUID') ||
        (currentToken === '(' && previousToken === 'getObjectFromGUID')
      );
    };

    /* ------------------------------- Completion Item Evaluation ------------------------------- */
    const completionItems: vscode.CompletionItem[] = [];
    // Simple Snippets
    if (line.trimEnd().endsWith(' do')) completionItems.push(this._cDict['endsWithDo']);
    if (line.trimEnd().endsWith(' then') && !line.includes('elseif'))
      completionItems.push(this._cDict['endsWithThen']);
    if (line.trimEnd().endsWith(' repeat')) completionItems.push(this._cDict['endsWithRepeat']);
    if (line.includes('function') && line.trimEnd().endsWith(')')) {
      let funcName = currentToken.substring(0, currentToken.lastIndexOf('('));
      funcName = funcName.substring(funcName.lastIndexOf(' ') + 1);
      funcName =
        funcName +
        vscode.workspace.getConfiguration('ttslua.autocompletion').get('coroutineSuffix');
      completionItems.push(this._cDict['fend']);
      completionItems.push(
        ...[
          {
            name: 'fcend',
            label: 'function...coroutine...end',
            snippet: `\n\tfunction ${funcName}()\n\t\t\${1}\n\t\treturn 1\n\tend\n\tstartLuaCoroutine(self, '${funcName}')\nend`,
          },
          {
            name: 'fcrend',
            label: 'function...coroutine...repeat...end',
            snippet: `\n\tfunction ${funcName}()\n\t\trepeat\n\t\t\tcoroutine.yield(0)\n\t\tuntil \${1}\n\t\treturn 1\n\tend\n\tstartLuaCoroutine(self, '${funcName}')\nend`,
          },
        ].map(v => {
          const vci = new vscode.CompletionItem(v.label, vscode.CompletionItemKind.Snippet);
          vci.insertText = new vscode.SnippetString(v.snippet);
          return vci;
        })
      );
    }
    // Standard Sections
    // This is where the magic happens 🎇
    const findResult = Object.entries(this._stdSectionCItems).find(([n]) =>
      isSection(stdSectionMatcher.get(n) ?? n)
    );
    if (findResult !== undefined) completionItems.push(...findResult[1]);

    // Extra Sections
    if (isPlayerSection()) completionItems.push(...this._extraSectionCItems['player']);
    if (isDefaultEventsSection()) {
      if (document.fileName.endsWith('-1.lua'))
        completionItems.push(...this._extraSectionCItems['defaultevents-global']);
      else completionItems.push(...this._extraSectionCItems['defaultevents']);
    }
    if (isGlobalSection()) {
      completionItems.push(this._cDict['require'], this._cDict['rConsole']);
      completionItems.push(...this._extraSectionCItems['globallyaccessibleconstantsfunctions']);
    }
    if (completionItems.length === 0 && isObjectSection())
      completionItems.push(...this._extraSectionCItems['object']);

    // Add labeled getObjectFromGUID after static getObjectFromGUID if appropriate
    if (previousToken.includes('=')) {
      // if 'getObjectFromGUID' is included in completionItems
      const getObjectIndex = completionItems.findIndex(v =>
        (v.insertText as vscode.SnippetString).value.startsWith('getObjectFromGUID')
      );
      if (getObjectIndex >= 0) {
        const id = line.match(/([^\s]+)\s*=[^=]*$/);
        if (id !== null) {
          // Filter non alfanumeric characters from identifier
          const cleanId = id[1].replace(/[^a-zA-Z0-9]/g, '');
          const guidSuffix = vscode.workspace
            .getConfiguration('ttslua')
            .get('guidSuffix') as string;
          // Deep Copy the completion item
          const smartGetObjectFromGUID: vscode.CompletionItem = Object.create(
            completionItems[getObjectIndex]
          );
          // Replace the snippet with the new one
          smartGetObjectFromGUID.label = `getObjectFromGUID(->${cleanId}${guidSuffix})`;
          smartGetObjectFromGUID.insertText = new vscode.SnippetString(
            `getObjectFromGUID($\{0:${cleanId}${guidSuffix}})`
          );
          // Add the new completion item
          completionItems.splice(getObjectIndex, 0, smartGetObjectFromGUID);
        }
      }
    }
    // Add truly smart getObjectFromGUID which suggests GUIDs from the game
    if (isGetObjectFromGUID()) {
      // const guidCompletionItems: vscode.CompletionItem[] = CompletionProvider._guids.map(guid => {
      const igObjs = TTSAdapter.getInstance().getInGameObjects();
      const guidCompletionItems: vscode.CompletionItem[] = Object.keys(igObjs).map(guid => {
        const obj = igObjs[guid];
        const name = obj.name || obj.iname || '';
        const completionItem = new vscode.CompletionItem(
          name.length > 0 ? `${name} (${guid})` : guid,
          vscode.CompletionItemKind.Value
        );
        completionItem.insertText = `'${guid}'`;
        completionItem.detail = obj.type;
        return completionItem;
      });
      completionItems.push(...guidCompletionItems);
    }
    return completionItems;
  }
}
