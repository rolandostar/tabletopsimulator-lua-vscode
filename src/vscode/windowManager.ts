/**
 * @file Window Manager
 * This file is responsible for managing the windows, mainly prompts.
 */

import * as vscode from 'vscode'
import L from '@/i18n'

/**
 * Prompts are functions which prompt the user for an action.
 *
 * They return a promise which resolves `False` if we can continue on "the happy path".
 * Thus should be named negatively to be used as a conditional, e.g. `if (await prompts.getScriptsCanceled()) return`.
 * They must never reject, as this will cause vscode to show a ~scary~ error message.
 */
type Prompt = () => Promise<boolean>

// Buttons are optional, to check if a button is required, check the prompt name in the i18n file
function promptFactory (name: string): Prompt {
  type PromptsKey = keyof typeof L.prompts
  return async () => {
    // Get strings from i18n
    const promptMessage = L.prompts[name as PromptsKey]() as string
    const promptButton =
      Object.prototype.hasOwnProperty.call(L.prompts, `${name}Button`)
        ? [L.prompts[`${name}Button` as PromptsKey]() as string]
        : undefined
    // Call the prompt, with the button if it exists
    const result = await vscode.window.showInformationMessage(
      promptMessage, { modal: true }, ...(promptButton ?? [])
    )
    // Return comparison or true if no button was provided
    return promptButton !== undefined ? result !== promptButton[0] : false
  }
}

// To generate the prompts, we filter the keys of the i18n file to remove the buttons
// Then we create a map of the prompts using the promptFactory
type PromptMap = Record<string, Prompt>
export const prompts: PromptMap =
  Object.keys(L.prompts)
    .filter(key => !key.endsWith('Button'))
    .reduce<PromptMap>((acc, name) => {
    acc[name] = promptFactory(name)
    return acc
  }, {})
