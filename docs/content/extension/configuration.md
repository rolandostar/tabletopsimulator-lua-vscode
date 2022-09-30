---
title: Configuration Details
description: Everything you wanted to know about each config item
---


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
