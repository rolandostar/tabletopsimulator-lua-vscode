---
title: Global Script Lock
description: Edge case which can lock you out!
---

On some previous version of the extension, there was a bug which would cause the extension to lock you out of the global script.

This would happen when the extension would send an empty string to the global script, which would cause the global script to lock up, and the savegame would no longer open up.

This issue would be fixed by opening the `savegame.json` file and adding any content to the global lua script.

To prevent this from happening, the extension **will not** allow you to save an empty global script.

If you don't require any functionality on the global script, this can be remediated by adding a simple comment.

```lua title="Global.-1.lua"
--
```
