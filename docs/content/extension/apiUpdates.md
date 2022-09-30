---
description: Game update just released? Let's update IntelliSense
---
# Autocompletion API Updates

As you may know, Tabletop Simulator receives updates from time to time, with these updates there's a good chance that the API offered for Lua has changed, which would mean that there would have to be a separate update for the extension incorporating these changes. For this reason this extension offers a simple and automated way to download the latest **available** API for TTS Lua, and store it locally on your machine to provide autocompletion items for VSCode's IntelliSense WITHOUT having to wait for a separate extension update.

This is done as a best-effort basis since there's no way to predict what might change in the future, the main purpose of this feature is to integrate the latest Lua API changes as soon as possible even if it's not perfect.

## How does it work?

Atom's autocompletion is stored here: https://github.com/Berserk-Games/atom-tabletopsimulator-lua/blob/master/lib/provider.coffee

Whenever Berserk updates Atom's autocompletion, executing the command `ttslua.updateCompletionItems` will download this file, and process it to be integrated into VSCode. This process however does depend on Atom's autocomplete being updated soon-ish after any game update.

## How to use it?

Bring up the command palette <kbd class="kbc-button-sm">Ctrl</kbd>+<kbd class="kbc-button-sm">Shift</kbd>+<kbd class="kbc-button-sm">P</kbd> and begin typing "Update Completion Items"


<!-- <h3>Press <kbd class="kbc-button">/</kbd> to search this site.</h3>
<p>Press <kbd class="kbc-button">Ctrl</kbd> + <kbd class="kbc-button">Shift</kbd> + <kbd class="kbc-button">R</kbd> to re-render this page.</p> -->