import * as vscode from 'vscode';

import type * as xml from '@/vscode/XMLTypes';
import type * as hscopes from '@/vscode/hscopes';

export default class XMLCompletionProvider implements vscode.CompletionItemProvider {
  // Hyper Scopes is an external extension API used to return the scope inside a document
  // It's used instead of vscode-textmate
  // https://marketplace.visualstudio.com/items?itemName=draivin.hscopes
  private _hsExt = vscode.extensions.getExtension<hscopes.HScopesAPI>('draivin.hscopes');
  private _hs: hscopes.HScopesAPI | undefined;
  private XMLCompletionData: xml.IXMLCompletionData = require('./XMLCompletionData').default;

  public async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.CompletionItem[] | vscode.CompletionList> {
    if (this._hsExt === undefined) throw new Error('Hyper Scopes extension not found');
    if (this._hs === undefined) this._hs = await this._hsExt.activate();
    const currentLine = document.lineAt(position).text.substring(0, position.character);
    const grammar = await this._hs.getGrammar('text.xml');
    if (grammar === null) {
      console.error('HyperScope returned undefined grammar');
      return [];
    }

    let ruleStack = null;
    let textTokens: {text: string; scopes: string[]}[] = [];
    for (const [i, line] of document.getText().split('\n').entries()) {
      if (i !== position.line) ruleStack = grammar.tokenizeLine(line, ruleStack).ruleStack;
      else {
        textTokens = grammar
          .tokenizeLine(currentLine, ruleStack)
          .tokens.map(t => {
            return {
              text: currentLine.substring(t.startIndex, t.endIndex),
              scopes: t.scopes,
            };
          })
          .filter(v => v.text.trim().length !== 0)
          .reverse();
        break;
      }
    }

    const include = new vscode.CompletionItem(
      '<Include src=""/>',
      vscode.CompletionItemKind.Snippet
    );
    include.insertText = new vscode.SnippetString('<Include src="$0"/>');

    if (textTokens.length === 0) {
      return [include];
    }

    /* ----------------------------------- Function Definition ---------------------------------- */
    const isAttribute =
      (textTokens[0].scopes.length === 2 && textTokens[0].scopes[1] === 'meta.tag.xml') ||
      (textTokens[0].scopes.includes('meta.tag.xml') && currentLine.endsWith(' '));
    const isTag =
      (textTokens[0].scopes.includes('entity.name.tag.localname.xml') ||
        textTokens[0].text === '<') &&
      !currentLine.endsWith(' ');
    const findNearestTag = () => {
      for (let i = 0; i < textTokens.length; i++) {
        const token = textTokens[i];
        if (token.scopes.includes('entity.name.tag.localname.xml')) return token.text;
      }
      return null;
    };
    /* --------------------------------------- Suggestions -------------------------------------- */
    const completionItems: vscode.CompletionItem[] = [];

    if (isTag) {
      this.XMLCompletionData.elementTypes.forEach(elementType => {
        elementType.items.forEach(item => {
          const citem = new vscode.CompletionItem(item.tag, vscode.CompletionItemKind.Property);
          citem.documentation = new vscode.MarkdownString(`[[Documentation]](${item.url})`);
          completionItems.push(citem);
        });
      });
    } else if (isAttribute) {
      // Search for the tag in XMLCompletionData
      const tag = findNearestTag();
      if (!tag) return [];
      this.XMLCompletionData.elementTypes.find(elementType => {
        return elementType.items.find(element => {
          if (element.tag === tag) {
            element.attributes.forEach(attribute => {
              const citem = new vscode.CompletionItem(
                attribute.name,
                vscode.CompletionItemKind.Property
              );
              citem.detail = attribute.type;
              citem.insertText = new vscode.SnippetString(
                `${attribute.name}="${
                  attribute.default && !attribute.default.startsWith('(')
                    ? `$\{0:${attribute.default}}`
                    : '$0'
                }"`
              );
              citem.documentation = new vscode.MarkdownString(
                `Default: ${attribute.default}\n\n${
                  attribute.description ? attribute.description + '\n\n' : ''
                }[[Learn More]](${element.url})`
              );
              completionItems.push(citem);
            });
            return true;
          }
          return false;
        });
      });
    }

    return completionItems;
  }
}
