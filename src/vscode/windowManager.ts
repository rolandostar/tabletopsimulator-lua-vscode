/**
 * @file Window Manager
 * This file is responsible for managing the windows, mainly prompts.
 */

import * as vscode from 'vscode'
import L from '@/i18n'

type Prompt = () => Promise<boolean>
type PromptMap = Record<string, Prompt>
/**
 * Prompts are functions which prompt the user for an action.
 *
 * They return a promise which resolves `True` if we can continue on "the happy path".
 *
 * They should be named to be used as a conditional, e.g. `if (await prompts.getScriptsConfirmed())`.
 *
 * They must never reject, as this will cause vscode to show a ~scary~ error message.
 */
export const prompts: PromptMap = {
  getScriptsConfirmed: async () => {
    return await vscode.window
      .showInformationMessage(
        L.prompts.getScriptsConfirm() as string,
        { modal: true },
        L.prompts.getScriptsConfirmButton() as string
      ) === L.prompts.getScriptsConfirmButton()
  },
  anotherThing: async () => {
    return true
  }
}
