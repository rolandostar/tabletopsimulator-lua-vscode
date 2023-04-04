import * as vscode from 'vscode'

/**
 * Prompts are functions which prompt the user for an action.
 *
 * They return a promise which resolves `True` if we can continue on "the happy path".
 *
 * They should be named to be used as a conditional, e.g. `if (await prompts.getScriptsConfirmed())`.
 *
 * They must never reject, as this will cause vscode to show a ~scary~ error message.
 */
type Prompt = () => Promise<boolean>
type PromptMap = Record<string, Prompt>
export const prompts: PromptMap = {
  getScriptsConfirmed: async () => {
    return await vscode.window
      .showInformationMessage(
        'Get Lua Scripts from game?\n\n This will erase any changes that you have made since' +
            'the last Save & Play.',
        { modal: true },
        'Get Scripts'
      ) === 'Get Scripts'
  },
  anotherThing: async () => {
    return true
  }
}
