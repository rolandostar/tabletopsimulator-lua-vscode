const os = require('os')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const vscode = require('vscode')

TTSLuaDir = path.join(os.tmpdir(), 'TabletopSimulator', 'Tabletop Simulator Scripts')
function tryCreateWorkspaceFolder() {
  try { if(!fs.existsSync(TTSLuaDir)) mkdirp.sync(TTSLuaDir) }
  catch(e) { console.error(`[TTSLua] Failed to create workspace folder: ${e}`) }
}

class FileHandler {
  constructor(basename) {
    this._basename = basename
    this._tempFile = path.normalize(path.join(TTSLuaDir, this._basename))
  }

  create(text) {
    let dirname = path.dirname(this._tempFile)
    mkdirp.sync(dirname)
    let file = fs.openSync(this._tempFile, 'w')
    fs.writeSync(file, text)
    fs.closeSync(file)
  }

  open() {
    vscode.workspace.openTextDocument(
      vscode.Uri.file(this._tempFile)
    ).then((doc) => {
      vscode.window.showTextDocument(doc, { preview: false, preserveFocus: true }).then(()=>{},
      (e, err) =>{
        console.error('1' + err + e)
      })
    })
  }
}

module.exports = {
  FileHandler,
  TTSLuaDir,
  tryCreateWorkspaceFolder
}
