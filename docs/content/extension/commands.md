---
sidebar_position: 2
---

# Commands

Commands can be triggered either by hotkey or via the Command Palette (<kbd class="kbc-button-sm">Ctrl</kbd>+<kbd class="kbc-button-sm">Shift</kbd>+<kbd class="kbc-button-sm">P</kbd>)

| Command                         | Description                                                                                                                                           | Hotkey          |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Get Lua Scripts                 | Once confirmed, this will pull all scripts from the game to the editor                                                                                | `Ctrl+Alt+L`    |
| Save And Play                   | This will save all currently modified files and then push them to be executed on the game                                                             | `Ctrl+Alt+S`    |
| Execute Lua              | Send currently selected text to the game to be executed in place. [Learn More](executeLua) | Palette + Context Menu |
| Open TTS Console++              | This command will open the Console++ Panel in VSCode to the side, where you'll find messages sent from the game and be able to send your own commands | ``Ctrl+Alt+` `` |
| Install Console++               | This is the automated install, once finished you'll be able to require Console++ in your scripts like so `require('vscode/console')`                  | Palette Only    |
| Update IntelliSense with latest TTS API | Downloads the latest available API for TTS Lua and updates IntelliSense autocompletion with it. [Learn More](apiUpdates)|Palette Only|
| Add Global include folder to workspace | Use this command to add the Global include folder to your workspace (`~/Documents/Tabletop Simulator`)                                       | Palette Only    |
| [<span style={{color: 'yellow'}}>Debug</span>] Force autocomplete update | As the name implies, this command is the same as the IntelliSense update but skipping version check, it will download and process the file regardless if it's the same as previously downloaded | Palette Only|