'use strict'

const vscode = require('vscode')
const TTSParser = require('./bbcode/tabletop')
const net = require('net')

var recvHandlerArray = {
  '0': function (recv) { // Push new Object (Scripting Editor on an object)

  }, '1': function (recv) { // Load New Game

  }, '2': function (recv) { // Print/Debug Message

  }, '3': function (recv) { // Error

  }, '4': function (recv) { // Custom Message

  }, '5': function (recv) { // Return Message (Execute Lua Code)

  }, '6': function (recv) { // Game Saved

  }, '7': function (recv) { // Object Created

  }
}

var sendHandler = {
  'getLuaScripts': function () {

  }, 'saveAndPlay': function () {

  }, 'customMessage': function () {

  }, 'executeLuaCode': function () {

  }
}

function recvHandler (recv, TTSConsolePanel) {
  console.log(recv)
  switch (recv.messageID) {
    case 0: openEditor(recv.scriptStates); break // Push new Object (https://api.tabletopsimulator.com/externaleditorapi/#pushing-new-object)
    // case 1: saveScripts(recv.scriptStates); break // Load a New Game (https://api.tabletopsimulator.com/externaleditorapi/#loading-a-new-game)
    case 2:// if(true) sendToPanel(recv.message, TTSConsolePanel);

    if (TTSConsolePanel.currentPanel) { // If panel available
      TTSConsolePanel.currentPanel.append(TTSParser.parse(recv.message))
    }

    break
    // case 3: if(true) sendToPanel('[' + recv.guid + '] ' + recv.errorMessagePrefix + recv.error, TTSConsolePanel, 'FF0000'); break
    // case 4: if(true) sendToPanel(recv.customMessage, TTSConsolePanel); break
    case 5: break;
    // case 6: if(false) sendToPanel(TTSConsolePanel); break
    case 7: break;
  }
}

class TTSServer {
  constructor(TTSConsolePanel) {
    this._server = net.createServer((socket) => {
      // Set timeout in case of unexpected connection drop
      socket.setTimeout(10000)
      socket.on('timeout', () => socket.end())
      // Normal disconnect after data read
      socket.on('end', () => {
        console.log('client disconnected')
        socket.end()
      })
      // Socket disposal
      socket.on('close', () => {
        console.log('client close')
      })
      // Data read
      socket.on('data', (input) => {
        //console.log(`Read ${input.length} bytes`)
        recvHandler(JSON.parse(input.toString()), TTSConsolePanel)
      })
    })
    this._server.on('listening', () => console.log('server bound'))
    this._server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log('Address in use, retrying...')
        setTimeout(() => {
          this._server.close()
          this._server.listen(39998)
        }, 1000)
      }
    })
    this._server.listen(39998)
  }

  close() {
    this._server.close()
  }
}


module.exports = TTSServer
