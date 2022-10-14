# Directory Warning

When you are not using git workspaces, the extension will warn you if you if there are any folders detected in the `In-Game Scripts` directory. Which probably means you are attempting to organize your scripts with folders, and make use of the `require` directive.

While the extension **does** resolve these required modules correctly, they are stored in a temporary directory  and will be deleted at your OS discretion.

This folder is located in `C:\Users\<User>\AppData\Local\Temp\TabletopSimulatorLua`

The warning will go away if you are using a [git workspace](/guides/versionControl) which are much more suited for large scale mods. Or you could disable the warning using the `ttslua.misc.disableDirectoryWarning` config.

```json
{
    "ttslua.misc.disableDirectoryWarning": "true"
}
```
