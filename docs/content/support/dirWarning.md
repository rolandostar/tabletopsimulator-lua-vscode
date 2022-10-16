# Directory Warning

When you are not using git workspaces, the extension will warn you if you if there are any folders detected in the `In-Game Scripts` directory.

This is because even when the extension **does** resolve these modules correctly, they are stored in a temporary directory and will be deleted at your OS discretion.

This folder is located in `C:\Users\<User>\AppData\Local\Temp\TabletopSimulatorLua`

The warning will go away if you are using a [git workspace](/guides/versionControl). Or disabling the warning using the `ttslua.misc.disableDirectoryWarning` config.

```json
{
  "ttslua.misc.disableDirectoryWarning": "true"
}
```
