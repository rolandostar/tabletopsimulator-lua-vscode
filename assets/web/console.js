// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
const vscode = acquireVsCodeApi();
const oldState = vscode.getState();

function scrollToBottom() {
  $('#data').scrollTop($('#data')[0].scrollHeight);
}

function sendCommand(text) {
  // Send a message back to the extension
  if (text.startsWith('>')) {
    vscode.postMessage({type: 'command', text});
  } else {
    vscode.postMessage({type: 'input', text});
  }
}

function clearConsole() {
  $('#data').empty();
  vscode.setState();
}

$(document).ready(function () {
  if (oldState) {
    $('#data').html(oldState)
    scrollToBottom();
  }
})

window.addEventListener('message', event => {
  console.log(`Llego comando: ${event.data.command}`);
  if(event.data.command === 'append') {
      // If current scroll + height of the window + 100 pixel tolerance
      const wasAtBottom = $('#data').scrollTop() + $('#data').height() + 100 >= $('#data')[0].scrollHeight;
      const newDiv = $('<div/>').append($.parseHTML(event.data.htmlString));
      if (event.data.class) newDiv.addClass(event.data.class);
      newDiv.appendTo('#data');
      vscode.setState($('#data').html());
      // If it was at bottom, continue at bottom
      if (wasAtBottom) scrollToBottom();
  } else if (event.data.command === 'clear') clearConsole();
});

$(document).dblclick(() => {
  const inputBox = $('#commandInput>input');
  if ($('#mainScript').attr('clearOnFocus') === 'true') inputBox.val('>');
  inputBox.focus();
});

$(document).on('keyup', e => {
  const inputBox = $('#commandInput>input');
  if (e.keyCode === 13) {
    if (inputBox.is(':focus')) {
      sendCommand(inputBox.val());
      inputBox.val('');
    } else {
      if ($('#mainScript').attr('clearOnFocus') === 'true') inputBox.val('>');
      inputBox.focus();
    }
  }
});

$(document).bind('mousewheel', event => {
  if (event.ctrlKey) {
    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
      // TODO: Font Size up
    } else {
      // TODO: Font Size down
    }
  }
});

$('#send').click(() => {
  sendCommand($('#commandInput>input').val());
});

$('#clear').click(clearConsole);