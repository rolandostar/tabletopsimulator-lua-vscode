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
<img src="https://badgen.net/badge/uses/JS/yellow"/>
<img src="https://badgen.net/badge/designed in/MS Paint/blue"/>
<img src="https://badgen.net/badge/made%20with/%E2%9D%A4/red"/>
</div>

## Features

- Get Scripts
- Send Scripts
- Syntax Highlight based on the official [Atom plugin](https://github.com/Berserk-Games/atom-tabletopsimulator-lua)
- Code autocompletion based on OliPro007's [Extension](https://github.com/OliPro007/tabletopsimulator-lua-vscode)
- #include support with nested, root, and scoped includes ([Read more](http://blog.onelivesleft.com/2017/08/atom-tabletop-simulator-package.html)) 
- Highly Configurable
- Built-in Console
  - Integration with [Console++](https://github.com/onelivesleft/Console) by onelivesleft ([Tutorial](http://blog.onelivesleft.com/2017/09/debugging-your-tts-mods-with-console.html)) w/ Automatic Installation!
  - Send commands from VSCode (Adds `onExternalCommand`)
  - Receive output and debug information on VSCode Panel
  - BBCode and nested colors support!

![Demo Reel](https://raw.githubusercontent.com/rolandostar/tabletopsimulator-lua-vscode/master/assets/docs/demo.gif)

## Requirements

- Visual Studio Code v1.35.1
- Tabletop Simulator v12.0.4

## Quick Installation

#### From the marketplace:

Launch VS Code Quick Open (`Ctrl+P`), paste the following command, and type enter.

`ext install tabletopsimulator-lua`

#### From package:

You can also Install from the VSIX Package, you can find it under [Releases](https://github.com/rolandostar/tabletopsimulator-lua-vscode/releases/latest)

![VSIX Install Menu](https://raw.githubusercontent.com/rolandostar/tabletopsimulator-lua-vscode/master/assets/docs/vsix.png)

## Manual Installation

Download or clone this repository and place it under:

- **Windows** `%USERPROFILE%\.vscode\extensions`
- **Mac** `$HOME/.vscode/extensions`
- **GNU/Linux** `$HOME/.vscode/extensions`

## Usage

* ``Ctrl+Alt+` ``: Open TTS Console++
* `Ctrl+Alt+L`: Get Lua Scripts
* `Ctrl+Alt+S`: Save And Play

###### Tip: Press enter or double click on the Console++ Panel to focus the command input at the bottom.

--------

#### Console++

This extension proves a quick and easy way to install Console++

By default, the TTS Console++ Panel will only show messages and errors from Tabletop, to enable further interaction you need to install  [Console++](https://github.com/onelivesleft/Console) along with a modified version that listens on `customMessages`.

Bring up the Command Palette (`Ctrl+Shift+P`) and look up:

​	>`TTSLua: Install Console++`

If successful you should see a notification near the bottom right letting you know so.

Finally activate the scripts by including them in your Global scope:

`#include <vscode/console>`

Save and Play (`Ctrl+Alt+S`) And you can now use the input textbox at the bottom of the Console++ Panel that will send commands to the game directly from VSCode. Prefixing these messages with `>` will send your input as a command for Console++.

[Here is a tutorial series on how to use Console++](http://blog.onelivesleft.com/2017/09/debugging-your-tts-mods-with-console.html)

You can also choose to not prefix a command and be able to catch them in TTS like this:

```lua
function onExternalCommand(input)
  -- input contains the string you entered from VS Code
  print('VSCode: ' .. input)
end
```

## Extension Settings

This extension contributes the following settings:

* `TTSLua.autoOpen`: Which files should be opened automatically. (Default: `Global`)
* `TTSLua.clearOnReload`: Enable to clear console history when reloading. (Default: `false`) 
* `TTSLua.consoleFontFamily`: Font family for console. (Default `Amaranth`)  
* `TTSLua.consoleFontSize`: Font size for console in pixels. (Default `18`)  
* `TTSLua.consoleInputHeight`: Set Height for command input in pixels. (Default: `15`) 
* `TTSLua.coroutinePostfix`: Postfix to be appended to coroutine functions. (Default: `_routine`)
* `TTSLua.createXml`: Create XML UI File for each Lua received. (Default: `false`)
* `TTSLua.clearOnFocus`: Enable to clear command input on input focus. (Default: `false`) 
* `TTSLua.guidPostfix`: Postfix of variable when guessing `getObjectFromGUID`. (Default: `_GUID`)
* `TTSLua.includeOtherFiles`: Insert other files specified in source code (Default: `true`)
* `TTSLua.logSave`: Enable to log a message when a save occurs. (Default: `true`) 
* `TTSLua.parameterFormat`: Formatting  for Autocomplete. (Default: `TYPE_name`)
* `TTSLua.parameterToDisplay`: Autocomplete parameter insertion. (Default: `Both`)

## Known Issues

Execute Lua Code is not supported.

Partial theme support. Needs more testing.

\#include doesn't work for XML UI Files.

Line numbers on error are mismatched when using \#include.

Command Input has no history. (`Arrow Up`)

Unable to add more Include Paths. (Only supports `%USERPROFILE%/Documents/Tabletop Simulator`)

Console panel sometimes displays print messages out of order.

## Release Notes

Check [CHANGELOG.md](https://github.com/rolandostar/tabletopsimulator-lua-vscode/blob/master/CHANGELOG.md)

## About
This project was motivated on trying out different solutions to communicate VSCode with TTS and being rather unsuccessful at that. I tried using [OliPro007's Extension](https://github.com/OliPro007/tabletopsimulator-lua-vscode) and was a bit finicky for me, I also checked out [dustinlacewell's vatts](https://github.com/dustinlacewell/vatts) and was able to retrieve scripts but not send them. I guess I'm just inexperienced setting up these extensions which is why I wanted to dive into it by making my own and hoped to streamline the process for someone else.

I kind of ended up doing my own thing.

I included OliPro007's autocomplete ported from Typescript and built a much more simple communication architecture, which probably means it has a bit worse performance, however it works out for my purposes.

If you have any suggestions feel free to contact me or submit a PR.


<div align="center">
<h2>Contact</h2>
<p>You can find me on <a href="http://steamcommunity.com/id/rolandostar/">Steam</a> and <a href="https://www.reddit.com/user/rolandostar">Reddit</a>!</p>
<p>If you like this extension, please consider a small donation.</p>
<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7PK5YQ9HR3Z52"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button"/></a>
</div>
