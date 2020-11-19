<div align="center">
<h2>Tabletop Simulator Lua Extension for VSCode</h2>
<br>
<img width="500" src="https://raw.githubusercontent.com/rolandostar/tabletopsimulator-lua-vscode/master/assets/docs/banner.png" alt="VSCode-TabletopSimulator-Lua">
<br>
<br>
</div>

<p align="center" color="#6a737d">
Extension for VSCode to make writing Lua scripts for  <a href="https://store.steampowered.com/app/286160/Tabletop_Simulator/">Tabletop Simulator</a> easier.
</p>

<div align="center">
<img src="https://badgen.net/badge/build/should be ok/green"/>
<img src="https://badgen.net/badge/uses/TS/blue"/>
<img src="https://badgen.net/badge/designed in/MS Paint/yellow"/>
<img src="https://badgen.net/badge/made%20with/%E2%9D%A4/red"/>
</div>

## Features

- Get/Send Scripts
- Syntax Highlight based on the official [Atom plugin](https://github.com/Berserk-Games/atom-tabletopsimulator-lua)
- Code autocompletion based on OliPro007's [Extension](https://github.com/OliPro007/vscode-tabletopsimulator-lua)
- Nested file support
  - `require("")` for Lua
  - `<Include src=""/>` for XML
  - Configurable search patterns and lookup directories (yes, plural)
  - Works with absolute directories, perfect for source controled projects
- Highly Configurable
- Built-in Console
  - Integration with [Console++](https://github.com/onelivesleft/Console) by onelivesleft ([Tutorial](http://blog.onelivesleft.com/2017/09/debugging-your-tts-mods-with-console.html)) w/ Automatic Installation!
  - Send commands from VSCode (Adds `onExternalCommand`)
  - Receive output and debug information on VSCode Panel
  - BBCode and nested colors support!

![Demo Reel](https://raw.githubusercontent.com/rolandostar/tabletopsimulator-lua-vscode/master/assets/docs/demo.gif)

## Requirements

- Visual Studio Code v1.50.0+
- Tabletop Simulator v12.4.3

## Quick Installation

#### From the marketplace

Launch VS Code Quick Open (`Ctrl+P`), paste the following command, and type enter.

`ext install tabletopsimulator-lua`

#### From package

You can also Install from the VSIX Package, you can find it under [Releases](https://github.com/rolandostar/tabletopsimulator-lua-vscode/releases/latest)

![VSIX Install Menu](https://raw.githubusercontent.com/rolandostar/tabletopsimulator-lua-vscode/master/assets/docs/vsix.png)

## Manual Installation

Download or clone this repository and place it under:

- **Windows** `%USERPROFILE%\.vscode\extensions`
- **Mac** `$HOME/.vscode/extensions`
- **GNU/Linux** `$HOME/.vscode/extensions`

## Usage

- ``Ctrl+Alt+` ``: Open TTS Console++
- `Ctrl+Alt+L`: Get Lua Scripts
- `Ctrl+Alt+S`: Save And Play

###### Tip: Press enter or double click on the Console++ Panel to focus the command input at the bottom

### Recomendations

###### Click each one to expand

<details>
  <summary>Debug your Lua code <i>step-by-step</i> with Enhanced Moonsharp</summary>
  
## Enhanced Moonsharp Debugging

WIP

</details>

<details>
  <summary>Add source control to your projects and keep track of every change to collaborate with other developers</summary>
  
## Source Control

WIP

</details>

<details>
  <summary>Enable custom suggestions and avoid errors using static analysis with EmmyLua</summary>
  
## EmmyLua

WIP

</details>

--------

### Console++

This extension proves a quick and easy way to install Console++

By default, the TTS Console++ Panel will only show messages and errors from Tabletop, to enable further interaction you need to install  [Console++](https://github.com/onelivesleft/Console) along with a modified version that listens on `customMessages`.

Bring up the Command Palette (`Ctrl+Shift+P`) and look up:

​`>TTSLua: Install Console++`

If successful you should see a notification near the bottom right letting you know so.

Finally activate the scripts by including them in your Global scope:

`require("vscode/console")`

Save and Play (`Ctrl+Alt+S`) And you can now use the input textbox at the bottom of the Console++ Panel that will send commands to the game directly from VSCode. Prefixing these messages with `>` will send your input as a command for Console++.

[Here is a tutorial series on how to use Console++](http://blog.onelivesleft.com/2017/09/debugging-your-tts-mods-with-console.html)

You can also choose to not prefix a command and be able to catch them in TTS like this:

```lua
function onExternalCommand(input)
  -- input contains the string you entered from VS Code
  print('VSCode: ' .. input)
end
```

### Nested File Feature

This extension, similar to the official Atom Plugin, allows developers to structure their scripts among several files, the way of doing so is with the following statements:

- `require("<FILE>")` for Lua
- `<Include src="<FILE>"/>` for XML

###### Replacing `<File>` for the filename you wish to retrieve, also works for absolute paths

Theres an ordered priority list from which these files will be looked up from, stopping at the first match:

1. Documents Folder: `~/Documents/Tabletop Simulator`
2. Folders described in `TTSLua.includeOtherFilesPaths` setting
3. Folders currently opened in the workspace

And specifically for Lua, the `TTSLua.searchBundlePattern` setting allows modification of the lookup pattern. The extension will look for files ending with `.ttslua` and `.lua` by default.

## Commands

Commands can be triggered either by hotkey or via the Command Palette (`Ctrl+Shift+P`)

| Command                         | Description                                                                                                                                           | Hotkey          |
|---------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|
| Open TTS Console++              | This command will open the Console++ Panel in VSCode to the side, where you'll find messages sent from the game and be able to send your own commands | ``Ctrl+Alt+` `` |
| Get Lua Scripts                 | Once confirmed, this will pull all scripts from the game to the editor                                                                                | `Ctrl+Alt+L`    |
| Save And Play                   | This will save all currently modified files and then push them to be executed on the game                                                             | `Ctrl+Alt+S`    |
| Install Console++               | This is the automated install, once finished you'll be able to require Console++ in your scripts like so `require('vscode/console')`                  | Palette Only    |
| Add include folder to workspace | Use this command to quickly add the default include folder to your workspace (`~/Documents/Tabletop Simulator`)                                       | Palette Only    |

## Extension Settings

This extension contributes the following settings:

| Setting                         | Description                                           | Default                |
|---------------------------------|-------------------------------------------------------|------------------------|
| `TTSLua.autoOpen`               | Which files should be opened automatically            | `Global`               |
| `TTSLua.clearOnReload`          | Enable to clear console history when reloading        | `false`                |
| `TTSLua.consoleFontFamily`      | Font family for console                               | `Amaranth`             |
| `TTSLua.consoleFontSize`        | Font size for console in pixels                       | `16`                   |
| `TTSLua.consoleInputHeight`     | Set Height for command input in pixels                | `27`                   |
| `TTSLua.coroutinePostfix`       | Postfix to be appended to coroutine functions         | `_routine`             |
| `TTSLua.createXml`              | Create XML UI File for each Lua received              | `false`                |
| `TTSLua.clearOnFocus`           | Enable to clear command input on input focus          | `false`                |
| `TTSLua.guidPostfix`            | Postfix of variable when guessing `getObjectFromGUID` | `_GUID`                |
| `TTSLua.includeOtherFiles`      | Enable file nesting                                   | `true`                 |
| `TTSLua.includeOtherFilesPaths` | Additional paths to search for files                  | `[]`                   |
| `TTSLua.bundleSearchPattern`    | Pattern used to look for additional files             | `["?.ttslua","?.lua"]` |
| `TTSLua.logSave`                | Enable to log a message when a save occurs            | `true`                 |
| `TTSLua.parameterFormat`        | Formatting for Autocomplete                           | `TYPE_name`            |
| `TTSLua.parameterToDisplay`     | Autocomplete parameter insertion                      | `Both`                 |

## Known Issues

###### In order from most difficult to least difficult to fix

1. Console panel sometimes displays print messages out of order.
2. Line numbers on error are mismatched when using `require()`.
3. Execute Lua Code is not supported.
4. Command Input has no history. (`Arrow Up`)
5. Partial theme support. Needs more testing.

## Release Notes

Check [CHANGELOG.md](https://github.com/rolandostar/tabletopsimulator-lua-vscode/blob/master/CHANGELOG.md)

## About

This project was motivated on trying out different solutions to communicate VSCode with TTS and being rather unsuccessful at that. I tried using [OliPro007's Extension](https://github.com/OliPro007/tabletopsimulator-lua-vscode) and was a bit finicky for me, I also checked out [dustinlacewell's vatts](https://github.com/dustinlacewell/vatts) and was able to retrieve scripts but not send them. I guess I'm just inexperienced setting up these extensions which is why I wanted to dive into it by making my own and hoped to streamline the process for someone else.

I kind of ended up doing my own thing.

I included OliPro007's snippet generation & autocomplete and built a much more simple communication architecture, which probably means it has a bit worse performance, however it works out for my purposes.

If you have any suggestions feel free to contact me or submit a PR.

<div align="center">
<h2>Contact</h2>
<p>You can find me on <a href="http://steamcommunity.com/id/rolandostar/">Steam</a> and <a href="https://www.reddit.com/user/rolandostar">Reddit</a>!</p>
<p>If you like this extension, please consider a small donation.</p>
<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7PK5YQ9HR3Z52"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button"/></a>
</div>
