---
title: Module Resolution 🎯
description: How does the extension resolve external files?
---

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