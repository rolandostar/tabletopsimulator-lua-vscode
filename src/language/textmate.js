"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const tm = getCoreNodeModule('vscode-textmate');
function getCoreNodeModule(moduleName) {
    try {
        return require(`${vscode.env.appRoot}/node_modules.asar/${moduleName}`);
    }
    catch (err) { }
    try {
        return require(`${vscode.env.appRoot}/node_modules/${moduleName}`);
    }
    catch (err) { }
    return null;
}
const grammarPaths = {
    'source.tts.lua': path.join(__dirname, '../../syntaxes/tts_lua.json')
};
let registry = new tm.Registry({
    loadGrammar: (scopeName) => {
        let p = grammarPaths[scopeName];
        if (p) {
            return new Promise((c, e) => {
                fs.readFile(p, (error, content) => {
                    if (error) {
                        e(error);
                    }
                    else {
                        let grammar = tm.parseRawGrammar(content.toString(), p);
                        c(grammar);
                    }
                });
            });
        }
        return null;
    }
});
let grammar = null;
function getScopes(line, cursor) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!grammar) {
            grammar = yield registry.loadGrammar('source.tts.lua');
        }
        let r = grammar.tokenizeLine(line);
        let token = r.tokens.find(token => {
            return cursor >= token.startIndex && cursor < token.endIndex;
        });
        if (token !== undefined) {
            return token.scopes;
        }
        else {
            return [];
        }
    });
}
exports.getScopes = getScopes;
//# sourceMappingURL=textmate.js.map
