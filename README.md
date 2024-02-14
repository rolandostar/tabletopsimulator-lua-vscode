<div align="center">
<h2>Tabletop Simulator Lua Extension for VSCode</h2>
<br>
<img width="500" src="https://raw.githubusercontent.com/rolandostar/tabletopsimulator-lua-vscode/main/media/docs/banner.png" alt="VSCode-TabletopSimulator-Lua">
<br>
<br>
</div>

<p align="center" color="#6a737d">
Extension for VSCode to make writing Lua scripts for  <a href="https://store.steampowered.com/app/286160/Tabletop_Simulator/">Tabletop Simulator</a> easier.
</p>

<div align="center">

[![Build Documentation](https://github.com/rolandostar/tabletopsimulator-lua-vscode/actions/workflows/build-docs.yaml/badge.svg?branch=main)](https://github.com/rolandostar/tabletopsimulator-lua-vscode/actions/workflows/build-docs.yaml)
[![Deploy Extension](https://github.com/rolandostar/tabletopsimulator-lua-vscode/actions/workflows/deploy-to-marketplace.yaml/badge.svg?branch=main)](https://github.com/rolandostar/tabletopsimulator-lua-vscode/actions/workflows/deploy-to-marketplace.yaml)
</div>
<div align="center">
<img src="https://badgen.net/badge/uses/TS/blue"/>
<img src="https://badgen.net/badge/designed in/MS Paint/yellow"/>
<img src="https://badgen.net/badge/made%20with/%E2%9D%A4/red"/>
</div>

## Features

- Get/Send Scripts
  - <img src="docs/static/img/new.png" width="80"/> New architecture, improving reliability
- <img src="docs/static/img/new.png" width="80"/> Execute Lua without Save & Play
- <img src="docs/static/img/new.png" width="80"/> Improved Code autocompletion for Lua
  - Smart `GUID` suggestions which scans your save file, it even detects newly-created objects.
  - Update to latest available TTS API without waiting for manual updates. ([Learn More](here))
- <img src="docs/static/img/new.png" width="80"/> Added Code autocompletion for XML!
- <img src="docs/static/img/new.png" width="80"/> Added Version Control Support, you can now more easily use Git to manage your scripts!
- <img src="docs/static/img/new.png" width="80"/> Hover over a `GUID` in VSCode to Highlight the object In-Game
- Nested file support
  - `require("")` for Lua
  - `<Include src=""/>` for XML
  - Configurable search patterns and lookup directories (yes, plural)
  - Works with absolute directories, perfect for source controlled projects
  - <img src="docs/static/img/new.png" width="80"/> Debug module resolution issues right in VSCode (Never again wonder why your file isn't reachable)
- <img src="docs/static/img/new.png" width="80"/> Improved Configuration (Made them clearer and categorized)
- Built-in Console
  - Integration with [Console++](https://github.com/onelivesleft/Console) by onelivesleft ([Tutorial](http://blog.onelivesleft.com/2017/09/debugging-your-tts-mods-with-console.html)) with Automatic Installation!
  - Send commands from VSCode (Adds `onExternalCommand`)
  - Receive output and debug information on VSCode Panel
  - BBCode and nested colors support!
- <img src="docs/static/img/new.png" width="80"/> Improved and extensive documentation available at [tts-vscode.rolandostar.com](tts-vscode.rolandostar.com)
  - Learn how to use version control, step-by-step debugging, and more!
- <img src="docs/static/img/upcoming.png" width="80"/> Experimental asset downloader, which helps you download and rehost assets via Github for your version-controlled projects.

<br/>

![Demo Reel](https://raw.githubusercontent.com/rolandostar/tabletopsimulator-lua-vscode/main/media/docs/demo.gif)

---

## [Installation & Usage](https://tts-vscode.rolandostar.com/extension/setup)

## Additional Documentation

- [Extension Configurations](https://tts-vscode.rolandostar.com/extension/configuration)
- [Extension Commands](https://tts-vscode.rolandostar.com/extension/commands)
- [Module Resolution (AKA Nested Files)]()
- [Console++]()

## Release Notes

Check [CHANGELOG.md](https://github.com/rolandostar/tabletopsimulator-lua-vscode/blob/main/CHANGELOG.md)

## About

This project was motivated on trying out different solutions to communicate VSCode with TTS and being rather unsuccessful at that. I tried using [OliPro007's Extension](https://github.com/OliPro007/tabletopsimulator-lua-vscode) and was a bit finicky for me, I also checked out [dustinlacewell's vatts](https://github.com/dustinlacewell/vatts) and was able to retrieve scripts but not send them. I guess I'm just inexperienced setting up these extensions which is why I wanted to dive into it by making my own and hoped to streamline the process for someone else.

I kind of ended up doing my own thing.

If you have any suggestions feel free to contact me or submit a PR.

<div align="center">
<h2>Contact</h2>
<p>You can find me on <a href="http://steamcommunity.com/id/rolandostar/">Steam</a> and <a href="https://www.reddit.com/user/rolandostar">Reddit</a>!</p>
<p>If you like this extension, please consider a small donation.</p>
<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7PK5YQ9HR3Z52"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button"/></a>
</div>
