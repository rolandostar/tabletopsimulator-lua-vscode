---
description: Everything you wanted to know about each config item
sidebar_position: 3
---
# Configuration Details

This extension contributes the following settings:
## File Management
| Name                         | Details                                           | Default                |  Code Reference  |
|---------------------------------|-------------------------------------------------------|------------------------|----|
| Auto Open | This happens every time the game sends all scripts | `Global`               |[Link](https://github.com/rolandostar/tabletopsimulator-lua-vscode/blob/main/src/TTSAdapter.ts#L487)|
| Create XML | Create XML UI File for each Lua received              | `false`                ||

## Autocompletion
| Name                         | Details                                           | Default                |  Code Reference  |
|---------------------------------|-------------------------------------------------------|------------------------|----|

## Console++
| Name                         | Details                                           | Default                |  Code Reference  |
|---------------------------------|-------------------------------------------------------|------------------------|----|

## Miscellaneous
| Name                         | Details                                           | Default                |  Code Reference  |
|---------------------------------|-------------------------------------------------------|------------------------|----|
| `TTSLua.clearOnReload`          | Enable to clear console history when reloading        | `false`                ||
| `TTSLua.consoleFontFamily`      | Font family for console                               | `Amaranth`             ||
| `TTSLua.consoleFontSize`        | Font size for console in pixels                       | `16`                   ||
| `TTSLua.consoleInputHeight`     | Set Height for command input in pixels                | `27`                   ||
| `TTSLua.coroutinePostfix`       | Postfix to be appended to coroutine functions         | `_routine`             ||
| `TTSLua.clearOnFocus`           | Enable to clear command input on input focus          | `false`                ||
| `TTSLua.guidPostfix`            | Postfix of variable when guessing `getObjectFromGUID` | `_GUID`                ||
| `TTSLua.includeOtherFiles`      | Enable file nesting                                   | `true`                 ||
| `TTSLua.includeOtherFilesPaths` | Additional paths to search for files                  | `[]`                   ||
| `TTSLua.bundleSearchPattern`    | Pattern used to look for additional files             | `["?.ttslua","?.lua"]` ||
| `TTSLua.logSave`                | Enable to log a message when a save occurs            | `true`                 ||
| `TTSLua.parameterFormat`        | Formatting for Autocomplete                           | `TYPE_name`            ||
| `TTSLua.parameterToDisplay`     | Autocomplete parameter insertion                      | `Both`                 ||
