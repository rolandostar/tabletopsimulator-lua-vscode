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
      "link": {type: "doc", id: "extension"},
      "items": [
        {
          "type": "autogenerated",
          dirName: 'extension',
        }
      ],
    },
    {
      "type": "category",
      "label": "Guides",
      "link": {type: "doc", id: "guides"},
      "items": [
        {
          "type": "autogenerated",
          dirName: 'guides',
        }
      ]
    },
    {
      "type": "category",
      "label": "Support",
      "items": [
        {
          "type": "autogenerated",
          dirName: 'support',
        }
      ]
    },
    'FAQ'
  ]
};

module.exports = sidebars;
