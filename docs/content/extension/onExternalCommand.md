---
description: A new function for you!
---

# External Command

You can also choose to not prefix a command and be able to catch them in TTS like this:

```lua
function onExternalCommand(input)
  -- input contains the string you entered from VS Code
  print('VSCode: ' .. input)
end
```