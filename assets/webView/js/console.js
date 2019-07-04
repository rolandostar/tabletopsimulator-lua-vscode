/* eslint-disable no-undef */
// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
const vscode = acquireVsCodeApi()

// const oldState = vscode.getState();
// console.log(oldState);
// vscode.setState({ count: currentCount });

// $(document).ready(function () {
//   // vscode.postMessage({ command: 'done' })
//   let dblclickClear = $('#mainScript').attr('dblClickClear')
//   console.log(dblclickClear)
// })

function jumpToPageBottom () {
  $('html, body').scrollTop($(document).height() - $(window).height())
}

function isAtBottom () {
  return $(window).scrollTop() + $(window).height() === $(document).height()
}

window.addEventListener('message', event => {
  console.log(event)
  switch (event.data.command) {
    case 'append':
      let wasAtBottom = isAtBottom()
      let newDiv = $('<div />').append($.parseHTML(event.data.htmlString))
      if (event.data.class) newDiv.addClass(event.data.class)
      newDiv.appendTo('#data')
      if (wasAtBottom) jumpToPageBottom()
      break
    case 'clear':
      $('#data').empty()
      vscode.postMessage({ type: 'done' })
      break
  }
})

$(document).dblclick(function () {
  let inputBox = $('#commandInput>input')
  console.log($('#mainScript').attr('clearOnFocus'))
  if ($('#mainScript').attr('clearOnFocus') === 'true') inputBox.val('>')
  inputBox.focus()
})

$(document).on('keyup', function (e) {
  let inputBox = $('#commandInput>input')
  if (e.keyCode === 13) {
    if (inputBox.is(':focus')) {
      // Send a message back to the extension
      let text = inputBox.val()
      if (text.startsWith('>')) vscode.postMessage({ type: 'command', text })
      else vscode.postMessage({ type: 'input', text })
      inputBox.val('')
    } else {
      if ($('#mainScript').attr('clearOnFocus') === 'true') inputBox.val('>')
      inputBox.focus()
    }
  }
})

$(document).bind('mousewheel', function (event) {
  if (event.ctrlKey) {
    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
      // TODO: Font Size up
    } else {
      // TODO: Font Size down
    }
  }
})
