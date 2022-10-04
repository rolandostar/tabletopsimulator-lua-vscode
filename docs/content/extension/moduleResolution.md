---
title: Module Resolution 🎯
description: How does the extension resolve external files?
---

This extension, similar to the official Atom Plugin, allows developers to structure their scripts among several files, the way of doing so is with the following statements:

- `require("<FILE>")` for Lua
- `<Include src="<FILE>"/>` for XML

There's an ordered priority list from which these files will be looked up from, stopping at the first match:

1. Documents Folder: `~/Documents/Tabletop Simulator`
2. Folders described in `TTSLua.includeOtherFilesPaths` setting
3. Folders currently opened in the workspace

And specifically for Lua, the `TTSLua.searchBundlePattern` setting allows modification of the lookup pattern. The extension will look for files ending with `.lua` by default.

## Example

<pre><code class="language-treeview">
root_folder/
|-- a first folder/
|   |-- holidays.mov
|   |-- javascript-file.js
|   `-- some_picture.jpg
|-- documents/
|   |-- spreadsheet.xls
|   |-- manual.pdf
|   |-- document.docx
|   `-- presentation.ppt
|       `-- test    
|-- empty_folder/
|-- going deeper/
|   |-- going deeper/
|   |   `-- going deeper/
|   |        `-- going deeper/
|   |            `-- .secret_file
|   |-- style.css
|   `-- index.html
|-- music and movies/
|   |-- great-song.mp3
|   |-- S01E02.new.episode.avi
|   |-- S01E02.new.episode.nfo
|   `-- track 1.cda
|-- .gitignore
|-- .htaccess
|-- .npmignore
|-- archive 1.zip
|-- archive 2.tar.gz
|-- logo.svg
`-- README.md
</code></pre>