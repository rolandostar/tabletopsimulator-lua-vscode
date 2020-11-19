/* eslint-disable no-undef */
// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
const vscode = acquireVsCodeApi();

// const oldState = vscode.getState();
// console.log(oldState);
// vscode.setState({ count: currentCount });

// $(document).ready(function () {
//   // vscode.postMessage({ command: 'done' })
//   let dblclickClear = $('#mainScript').attr('dblClickClear')
//   console.log(dblclickClear)
// })

function jumpToPageBottom() {
  $('html, body').scrollTop($(document).height() - $(window).height());
}

function isAtBottom() {
  // If current scroll + height of the window + 10 pixel tolerance
  return $(window).scrollTop() + $(window).height() + 10 >= $(document).height();
}

window.addEventListener('message', (event) => {
  switch (event.data.command) {
    case 'append': {
      const wasAtBottom = isAtBottom();
      console.log(wasAtBottom);
      const newDiv = $('<div />').append($.parseHTML(event.data.htmlString));
      if (event.data.class) newDiv.addClass(event.data.class);
      newDiv.appendTo('#data');
      if (wasAtBottom) jumpToPageBottom();
      break;
    }
    case 'clear':
      $('#data').empty();
      vscode.postMessage({ type: 'done' });
      break;
    default: break;
  }
});

$(document).dblclick(() => {
  const inputBox = $('#commandInput>input');
  if ($('#mainScript').attr('clearOnFocus') === 'true') inputBox.val('>');
  inputBox.focus();
});

$(document).on('keyup', (e) => {
  const inputBox = $('#commandInput>input');
  if (e.keyCode === 13) {
    if (inputBox.is(':focus')) {
      // Send a message back to the extension
      const text = inputBox.val();
      if (text.startsWith('>')) vscode.postMessage({ type: 'command', text });
      else vscode.postMessage({ type: 'input', text });
      inputBox.val('');
    } else {
      if ($('#mainScript').attr('clearOnFocus') === 'true') inputBox.val('>');
      inputBox.focus();
    }
  }
});

$(document).bind('mousewheel', (event) => {
  if (event.ctrlKey) {
    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
      // TODO: Font Size up
    } else {
      // TODO: Font Size down
    }
  }
});
