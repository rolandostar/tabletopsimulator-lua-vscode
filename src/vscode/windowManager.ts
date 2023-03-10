import * as vscode from 'vscode';

/**
 * Prompts are functions which prompt the user for an action.
 * 
 * They return a promise which resolves `True` if we can continue on "the happy path".
 * 
 * They should be named to be used as a conditional, e.g. `if (await prompts.getScriptsConfirmed())`.
 * 
 * They must never reject, as this will cause vscode to show a ~scary~ error message.
 */
export const prompts = {
  getScriptsConfirmed: async () => {
    return new Promise<boolean>(async (resolve) => {
      const answer: 'Get Scripts' | undefined = await vscode.window
        .showInformationMessage(
          'Get Lua Scripts from game?\n\n This will erase any changes that you have made since' +
            'the last Save & Play.',
          { modal: true },
          'Get Scripts',
        );
      if (answer === 'Get Scripts') resolve( true );
      else resolve(false);
    });
  },
  anotherThing: async () => {
    return "something";
  }
};