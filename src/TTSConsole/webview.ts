/**
 * @file This file is the script that runs in the webview panel. It is responsible for
 * handling user input and displaying the output of the TTS console.
 *
 * Normal context is unavailable in this file, so it is not possible to use the
 * `vscode` namespace or any other VS Code API. For that reason, the `acquireVsCodeApi`
 * function is used to get a reference to the `vscode` hooks.
 *
 * This file is compiled separately from the rest of the extension, with a different target
 * and module system. This is because the webview panel runs in a browser environment, and
 * the rest of the extension runs in a Node.js environment.
 */

import {
  provideVSCodeDesignSystem,
  vsCodeButton,
  vsCodeTextField,
  type TextField
} from '@vscode/webview-ui-toolkit'

type MessageFromExtension =
  | { command: 'append', htmlString: string, class?: string }
  | { command: 'clear' }
  | { command: 'commandState', state: boolean }

provideVSCodeDesignSystem().register(vsCodeButton())
provideVSCodeDesignSystem().register(vsCodeTextField())

const vscode = acquireVsCodeApi<string>()

window.addEventListener('load', main)
function main (): void {
  const previousState = vscode.getState()
  if (previousState !== undefined) {
    const dataElement: HTMLElement | null = document.getElementById('data')
    if (dataElement !== null) {
      dataElement.innerHTML = previousState
      dataElement.scrollTop = dataElement.scrollHeight
    }
  }
}

const sendCommand = (text: string): void => {
  vscode.postMessage({ type: text.startsWith('>') ? 'command' : 'input', text })
}

function clearConsole (): void {
  const dataElement: HTMLElement | null = document.getElementById('data')
  if (dataElement !== null) {
    dataElement.textContent = ''
    vscode.setState('')
  }
}

window.addEventListener('message', (event: MessageEvent) => {
  const eventMessage: MessageFromExtension = event.data
  console.log(`Llego comando: ${eventMessage.command}`)
  if (eventMessage.command === 'append') {
    const dataElement: HTMLElement | null = document.getElementById('data')
    if (dataElement === null) return
    // Check if at bottom
    const wasAtBottom: boolean =
      dataElement.scrollTop + dataElement.offsetHeight + 100 >= dataElement.scrollHeight

    // Create new div
    const newDiv: HTMLDivElement = document.createElement('div')
    const parser: DOMParser = new DOMParser()
    const parsedHtml: Document = parser.parseFromString(eventMessage.htmlString, 'text/html')
    newDiv.append(...Array.from(parsedHtml.body.childNodes))

    // Add class (if applicable)
    if (eventMessage.class !== undefined) newDiv.classList.add(eventMessage.class)
    dataElement.append(newDiv)
    vscode.setState(dataElement.innerHTML)
    if (wasAtBottom) dataElement.scrollTop = dataElement.scrollHeight
  } else if (eventMessage.command === 'clear') clearConsole()
  else if (eventMessage.command === 'commandState') {
    const span = document.getElementById('commandState')
    if (eventMessage.state) {
      // remove class "codicon-text-size" from span
      span?.classList.remove('codicon-text-size')
      // add class "codicon-debug-console" to span
      span?.classList.add('codicon-debug-console')
    } else {
      // remove class "codicon-debug-console" from span
      span?.classList.remove('codicon-debug-console')
      // add class "codicon-text-size" to span
      span?.classList.add('codicon-text-size')
    }
  }
})

document.addEventListener('dblclick', (): void => {
  const inputBox = document.getElementById('input') as TextField | null
  if (inputBox === null) return
  const mainScript = document.getElementById('mainScript')
  const clearOnFocusAttr = mainScript?.getAttribute('clearOnFocus') ?? null
  if (clearOnFocusAttr === 'true') inputBox.value = '>'
  inputBox.focus()
})

document.addEventListener('keyup', (e: KeyboardEvent): void => {
  const inputBox = document.getElementById('input') as TextField | null
  if (inputBox === null) return
  if (e.code === 'Enter') {
    if (document.activeElement === inputBox) {
      sendCommand(inputBox.value)
      inputBox.value = ''
    } else {
      const mainScript: HTMLElement | null = document.getElementById('mainScript')
      const clearOnFocusAttr: string | null = mainScript?.getAttribute('clearOnFocus') ?? null
      if (clearOnFocusAttr === 'true') inputBox.value = '>'
      inputBox.focus()
    }
  }
})

document.addEventListener('wheel', (event: WheelEvent): void => {
  if (event.ctrlKey) {
    if (event.deltaY < 0) {
      // TODO: Font Size up
      console.log('Font Size up')
    } else {
      // TODO: Font Size down
      console.log('Font Size down')
    }
  }
})

document.getElementById('send')?.addEventListener('click', (): void => {
  const inputBox = document.getElementById('input') as TextField | null
  if (inputBox === null) return
  sendCommand(inputBox.value)
})

document.getElementById('clear')?.addEventListener('click', clearConsole)
