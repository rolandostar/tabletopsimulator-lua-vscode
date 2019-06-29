// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
const vscode = acquireVsCodeApi();

// const oldState = vscode.getState();
// console.log(oldState);
// vscode.setState({ count: currentCount });

function jumpToPageBottom() {
  $('html, body').scrollTop( $(document).height()-$(window).height());
}

function isAtBottom() {
  return $(window).scrollTop() + $(window).height() === $(document).height();
}

// Handle messages sent from the extension to the webview
window.addEventListener('message', event => {
  var wasAtBottom = isAtBottom()
  $("<div />").append($.parseHTML(event.data)).appendTo("#data")
  if (wasAtBottom) jumpToPageBottom()
})

$(document).dblclick(function() {
  $('#commandInput>input').focus()
})

$(document).bind('mousewheel', function (event) {
  // do your stuff
  if (event.ctrlKey) {
    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
      // TODO: Font Size up
    } else {
      // TODO: Font Size down
    }
  }
});

$("#commandInput>input").on('keyup', function (e) {
  if (e.keyCode == 13) {
      // Send a message back to the extension
      vscode.postMessage({
        command: 'customMessage',
        text: $("#commandInput>input").val().substring(1)
      })
      $("#commandInput>input").val(">")
  }
});
