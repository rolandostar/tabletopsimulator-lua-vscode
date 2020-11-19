/* eslint-disable no-empty */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

const { getCoreNodeModule } = require('utils/getCoreNodeModule');

const tm = getCoreNodeModule('vscode-textmate');
const oniguruma = getCoreNodeModule('vscode-oniguruma');

const grammarPaths: { [key: string]: any } = {
  'source.lua': path.join(__dirname, './syntaxes/lua.tmLanguage.json'),
};

const wasmBin = fs.readFileSync(path.join(vscode.env.appRoot, 'node_modules.asar', 'vscode-oniguruma', 'release', 'onig.wasm')).buffer;
const vscodeOnigurumaLib = oniguruma.loadWASM(wasmBin).then(() => ({
  createOnigScanner: (sources: string[]) => new oniguruma.OnigScanner(sources),
  createOnigString: (s: string) => new oniguruma.OnigString(s),
}));

const registry = new tm.Registry({
  onigLib: vscodeOnigurumaLib,
  loadGrammar: (scopeName: string) => {
    const p: any = grammarPaths[scopeName];
    if (p) {
      return new Promise((c, e) => {
        fs.readFile(p, (error, content) => {
          if (error) {
            e(error);
          } else {
            const grammar = tm.parseRawGrammar(content.toString(), p);
            c(grammar);
          }
        });
      });
    }

    return null;
  },
});

let grammar: any = null;

export default async function getScopes(line: string, cursor: number): Promise<string[]> {
  if (!grammar) {
    grammar = await registry.loadGrammar('source.lua');
  }

  const r = grammar.tokenizeLine(line);
  const token: any = r.tokens.find((e: { startIndex: number; endIndex: number; }) => cursor >= e.startIndex && cursor < e.endIndex);

  if (token !== undefined) {
    return token.scopes;
  }
  return [];
}
