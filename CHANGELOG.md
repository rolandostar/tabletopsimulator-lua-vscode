# Change Log

All notable changes to the "tabletopsimulator-lua" extension will be documented in this file.

## [1.0.5]
- Fixed published packaging versioning issue

## [1.0.4]
- Fixes multiple includes (Thanks to @jonahwh)

## [1.0.3]

- Fixed issue where multiple objects with same object name would overwrite each other. (Thanks stom66 @ GitHub)

## [1.0.2]

- Fixed onObjectDrop suggestion (Thanks Eldin @ Discord)

## [1.0.1]

- README fixes

## [1.0.0]

- Initial release
- Added LICENCE
- Added README.md
- Added documentation assets
- Feature Complete: Integration with Console++ by onelivesleft
  - Added WebPanelView for output
  - Added CSS/JS for WebPanelView
  - Added Command Input to be sent via CustomMessage
- Feature Complete: Get Scripts / Save And Play
  - Added Print/Debug Message Communication
  - Added Error Messages with special formatting
- Feature Complete: #include Support
  - Handling of nested includes
  - Root includes
  - Scoped includes
- Added Feature: Syntax Highlight
- Added Feature: Code autocompletion based on OliPro007's Extension
- Bundled default Console++ and expanded it to add onExternalCommand()
