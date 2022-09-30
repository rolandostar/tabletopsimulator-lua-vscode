/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    'root',
    {
      "type": "category",
      "label": "Extension",
      "link": {type: "doc", id: "extension/index"},
      "items": [
        'extension/installation',
        'extension/configuration',
        'extension/moduleResolution',
        'extension/apiUpdates',
        'extension/globalScriptLock',
        'extension/onExternalCommand',
      ],
    },
    {
      "type": "category",
      "label": "Guides",
      "link": {type: "doc", id: "guides/index"},
      "items": [
        'guides/sourceControl',
        'guides/debugging',
      ]
    }
  ]
};

module.exports = sidebars;
