'use strict'

const os = require('os')
const fs = require('fs-extra')
const path = require('path')
const mkdirp = require('mkdirp')
const vscode = require('vscode')

let TTSLuaDir = path.join(os.tmpdir(), 'TabletopSimulator', 'Tabletop Simulator Scripts')
let docsFolder = path.join(os.homedir(), 'Documents', 'Tabletop Simulator')

function tryCreateWorkspaceFolder () {
  try { if (!fs.existsSync(TTSLuaDir)) mkdirp.sync(TTSLuaDir) } catch (e) { console.error(`[TTSLua] Failed to create workspace folder: ${e}`) }
}

function tryInstallConsole (extensionPath) {
  let consoleSrc = path.join(extensionPath, 'src', 'installScripts')
  fs.copy(consoleSrc, docsFolder, function (err) {
    if (err) console.error(`[TTSLua] Console++ Installation Failed. ${err}`)
    else vscode.window.showInformationMessage(`Console++ Installation Successful`)
  })
}

class FileHandler {
  constructor (basename) {
    this._basename = basename
    this._tempFile = path.normalize(path.join(TTSLuaDir, this._basename))
  }

  create (text) {
    let dirname = path.dirname(this._tempFile)
    mkdirp.sync(dirname)
    let file = fs.openSync(this._tempFile, 'w')
    fs.writeSync(file, text)
    fs.closeSync(file)
  }

  open () {
    return vscode.window.showTextDocument(vscode.Uri.file(this._tempFile), {
      preserveFocus: true,
      preview: false
    })
  }
}

module.exports = {
  FileHandler,
  TTSLuaDir,
  docsFolder,
  tryCreateWorkspaceFolder,
  tryInstallConsole
}
