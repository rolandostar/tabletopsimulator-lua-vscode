// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'TTS VSCode Extension Documentation',
  url: 'https://tts-vscode.rolandostar.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'rolandostar', // Usually your GitHub org/user name.
  projectName: 'tabletopsimulator-lua-vscode', // Usually your repo name.
  trailingSlash: false,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  stylesheets: [
    'https://unpkg.com/keyboard-css@1.2.4/dist/css/main.min.css'
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'content',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/rolandostar/tabletopsimulator-lua-vscode/tree/main/docs',
          sidebarCollapsed: false,
          sidebarCollapsible: false,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      require.resolve("@cmfcmf/docusaurus-search-local"),
      {
        indexBlog: false,
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'TTS VSCode Docs',
        logo: {
          alt: 'Tabletop Simulator VSCode Extension Logo',
          src: 'img/icon.png',
        },
        items: [
          {
            href: 'https://github.com/rolandostar/tabletopsimulator-lua-vscode',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        logo: {
          src: 'img/logo.png',
        },
        links: [
          {
            href: 'https://github.com/rolandostar/tabletopsimulator-lua-vscode',
            label: 'GitHub'
          },
          {
            label: 'Reddit',
            href: 'https://www.reddit.com/user/rolandostar',
          },
          {
            label: 'Discord',
            href: 'https://discordapp.com/invite/docusaurus',
          },
          {
            label: 'Steam',
            href: 'http://steamcommunity.com/id/rolandostar/',
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()}. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['lua'],
      },
    }),
};

module.exports = config;
