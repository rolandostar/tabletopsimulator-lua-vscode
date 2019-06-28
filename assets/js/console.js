// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {

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

  // // Send a message back to the extension
  // vscode.postMessage({
  //   command: 'alert',
  //   text: '🐛  on line ' + currentCount
  // });

  // Handle messages sent from the extension to the webview
  window.addEventListener('message', event => {
    const message = event.data; // The json data that the extension sent
    switch (message.command) {
        case 'append':
            var wasAtBottom = isAtBottom()
            $("<div />").text("Message: " + message.text).appendTo("#data")
            if (wasAtBottom) jumpToPageBottom()
            break;
    }
  })
}())
