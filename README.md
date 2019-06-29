<div align="center">
<h2>Tabletop Simulator Lua Extension for VSCode</h2>
<br>
<img width="500" src="assets/logo.png" alt="2Frame">
<br>
<br>
</div>

<p align="center" color="#6a737d">
Extension for VSCode to make writing Lua scripts for  <a href="https://store.steampowered.com/app/286160/Tabletop_Simulator/">Tabletop Simulator</a> easier.
</p>

<div align="center">
<img src="https://forthebadge.com/images/badges/built-with-love.svg"/>
<img src="https://forthebadge.com/images/badges/uses-js.svg"/>
<img src="https://forthebadge.com/images/badges/designed-in-ms-paint.svg"/>
</div>

## Features

- Get Scripts (getObjects)
- Send Scripts (saveAndPlay)
- Syntax Highlight based on the official [Atom plugin](https://github.com/Berserk-Games/atom-tabletopsimulator-lua)
- Code autocompletion based on OliPro007's [Extension](https://github.com/OliPro007/vscode-tabletopsimulator-lua)
- Integration with [Console++](https://github.com/onelivesleft/Console) by onelivesleft ([Tutorial](http://blog.onelivesleft.com/2017/09/debugging-your-tts-mods-with-console.html))
  - Send commands from VSCode
  - Receive output and debug information on VSCode Panel
  - (Optional) Automatic installation of Console++
- Highly Configurable

## Requirements

- Visual Studio Code v1.35.1
- Tabletop Simulator v12.0.4

## Quick Installation



## Manual Installation

## Usage

* `ctrl+alt+\``: Open TTS Console++
* `ctrl+alt+l`: Get Lua Scripts
* `ctrl+alt+s`: Save And Play

## Extension Settings

clear on reload: clear terminal history when opening new game or reloading
autosave notification: coose if you wish to show autosave on log
terminal font size, command input height
clear command on double click?
open terminal beside or same?
createxml?

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

Execute Lua Code is not supported.

## Release Notes

Check CHANGELOG.md

## About
This project was motivated on trying out different solutions to communicate VSCode with TTS and being rather unsuccessful at that. I tried using [OliPro007's Extension](https://github.com/OliPro007/vscode-tabletopsimulator-lua) and was a bit finicky for me, I also checked out [dustinlacewell's vatts](https://github.com/dustinlacewell/vatts) and was able to retrieve scripts but not send them. I guess I'm just inexperienced setting up these extensions which is why I wanted to dive into it by making my own and hopefully streamlining the process for someone else.

I included OliPro007's autocomplete ported from Typescript and built a much more simple communication architecture, which probably means it has worse performance.


<div align="center">
<h2>Contact</h2>
<p>You can find me on <a href="http://steamcommunity.com/id/rolandostar/">Steam</a> and <a href="https://www.reddit.com/user/rolandostar">Reddit</a>!</p>
<p>If you like this extension, please consider a small donation.</p>
<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7PK5YQ9HR3Z52"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button"/></a>
</div>
