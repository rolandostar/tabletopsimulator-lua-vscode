/** UNUSED
 * @file Sample server
 * This file contains a sample server that can be used to test the language client
 */

import {
  CodeAction, CodeActionKind, Command, createConnection, Diagnostic, DiagnosticSeverity, Position,
  Range, TextDocumentEdit, TextDocuments, TextDocumentSyncKind, TextEdit
} from 'vscode-languageserver/node'
import { TextDocument } from 'vscode-languageserver-textdocument'

const connection = createConnection()
connection.console.info(`Sample server running in node ${process.version}`)

const documents = new TextDocuments<TextDocument>(TextDocument)
documents.listen(connection)

connection.onInitialize(() => {
  return {
    capabilities: {
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ['.', ':']
      }
      // codeActionProvider: true,
      // textDocumentSync: {
      //   openClose: true,
      //   change: TextDocumentSyncKind.Incremental
      // },
      // executeCommandProvider: {
      //   commands: ['sample.fixMe']
      // }
    }
  }
})

function validate (document: TextDocument): void {
  void connection.sendDiagnostics({
    uri: document.uri,
    version: document.version,
    diagnostics: [
      Diagnostic.create(Range.create(0, 0, 0, 10), 'Something is wrong here', DiagnosticSeverity.Warning)
    ]
  })
}

documents.onDidOpen((event: any) => {
  validate(event.document)
})

documents.onDidChangeContent((event: any) => {
  validate(event.document)
})

connection.onCodeAction((params: any) => {
  const textDocument = documents.get(params.textDocument.uri)
  if (textDocument === undefined) {
    return undefined
  }
  const title = 'With User Input'
  return [CodeAction.create(title, Command.create(title, 'sample.fixMe', textDocument.uri), CodeActionKind.QuickFix)]
})

connection.onExecuteCommand(async (params: any) => {
  if (params.command !== 'sample.fixMe' || params.arguments === undefined) {
    return
  }

  const textDocument = documents.get(params.arguments[0])
  if (textDocument === undefined) {
    return
  }
  const newText = typeof params.arguments[1] === 'string' ? params.arguments[1] : 'Eclipse'
  return await connection.workspace.applyEdit({
    documentChanges: [
      TextDocumentEdit.create({ uri: textDocument.uri, version: textDocument.version }, [
        TextEdit.insert(Position.create(0, 0), newText)
      ])
    ]
  })
})

connection.listen()
