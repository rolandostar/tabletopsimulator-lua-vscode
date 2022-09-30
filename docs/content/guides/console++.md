# Console++

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


###### Tip: Press enter or double click on the Console++ Panel to focus the command input at the bottom