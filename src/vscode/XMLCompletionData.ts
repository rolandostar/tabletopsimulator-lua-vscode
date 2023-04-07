export default {
  version: '0238d1652d756e50e706d74cbac03306c9cb7cf1',
  attributeTypes: [
    {
      type: 'General',
      url: 'https://api.tabletopsimulator.com/ui/attributes/#general-attributes',
      items: [
        {
          name: 'active',
          description:
            'Specifies whether or not this element and its children are visible and contribute to layout. Modifying this via script will not trigger animations.',
          type: 'bool',
          default: 'true',
        },
        {
          name: 'class',
          description:
            'A list of classes, separated by spaces. An element will inherit attributes from any of its classes defined in Defaults.',
          type: 'string',
          default: '(none)',
        },
        {
          name: 'id',
          description: 'A unique string used to identify the element from Lua scripting.',
          type: 'string',
          default: '(none)',
        },
        {
          name: 'visibility',
          description:
            'A pipe-separated list of visibility targets. An element is always treated as inactive to players not specified here.',
          type: 'string',
          default: '(visible to all)',
        },
      ],
    },
    {
      type: 'Text',
      url: 'https://api.tabletopsimulator.com/ui/attributes/#text-attributes',
      items: [],
    },
  ],
  elementTypes: [
    {
      type: 'Custom',
      items: [
        {
          tag: 'Include',
          url: 'https://tts-vscode.rolandostar.com/extension/moduleResolution',
          attributes: [
            {
              name: 'src',
              description: 'The path to the file to include.',
              type: 'string',
              default: '(none)',
            },
          ],
        },
      ],
    },
    {
      type: 'Basic',
      items: [
        {
          tag: 'Text',
          url: 'https://api.tabletopsimulator.com/ui/basicelements/#text',
          attributes: [
            {
              name: 'text',
              description:
                'This can be used to determine the text that appears. It can also be modified externally by the script.',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'alignment',
              type: 'UpperLeft | UpperCenter | UpperRight | MiddleLeft | MiddleCenter | MiddleRight | LowerLeft | LowerCenter | LowerRight',
              default: 'MiddleCenter',
            },
            {
              name: 'color',
              type: 'color',
              default: '#323232',
            },

            {
              name: 'fontStyle',
              type: 'Normal | Bold | Italic | BoldItalic',
              default: 'Normal',
            },
            {
              name: 'fontSize',
              type: 'float',
              default: '14',
            },
            {
              name: 'resizeTextForBestFit',
              description: 'Resize text to fit?',
              type: 'bool',
              default: 'false',
            },
            {
              name: 'resizeTextMinSize',
              description: 'Minimum font size',
              type: 'float',
              default: '10',
            },
            {
              name: 'resizeTextMaxSize',
              description: 'Maximum font size',
              type: 'float',
              default: '40',
            },
            {
              name: 'horizontalOverflow',
              type: 'Wrap | Overflow',
              default: 'Overflow',
            },
            {
              name: 'verticalOverflow',
              type: 'Truncate | Overflow',
              default: 'Truncate',
            },
          ],
        },
        {
          tag: 'Image',
          url: 'https://api.tabletopsimulator.com/ui/basicelements/#image',
          attributes: [
            {
              name: 'image',
              description:
                'The name of the file in the asset manager (upper right corner of the scripting window in-game).',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'color',
              type: 'color',
              default: '#FFFFFF',
            },
            {
              name: 'type',
              description: 'Image Type',
              type: 'Simple | Sliced | Tiled | Filled',
              default: 'Simple',
            },
            {
              name: 'raycastTarget',
              description: 'Should this image block clicks from passing through it?',
              type: 'bool',
              default: 'true',
            },
          ],
        },
        {
          tag: 'ProgressBar',
          url: 'https://api.tabletopsimulator.com/ui/basicelements/#progressbar',
          attributes: [
            {
              name: 'image',
              description: 'Background Image',
              type: '(path to image)',
              default: '(none)',
            },
            {
              name: 'color',
              description: 'Background Color',
              type: 'color',
              default: '#FFFFFF',
            },
            {
              name: 'fillImage',
              description: 'Fill Image',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'fillImageColor',
              description: 'Fill Color',
              type: 'color',
              default: '#FFFFFF',
            },
            {
              name: 'percentage',
              description: 'Percentage to Display',
              type: 'float',
              default: '0',
            },
            {
              name: 'showPercentageText',
              description: 'Is the percentage text displayed?',
              type: 'bool',
              default: 'true',
            },
            {
              name: 'percentageTextFormat',
              description: 'Format to use for the percentage text',
              type: 'string',
              default: '0.00',
            },
            {
              name: 'textColor',
              description: 'Percentage Text Color',
              type: 'color',
              default: '#000000',
            },
            {
              name: 'textShadow',
              description: 'Percentage Text Shadow Color',
              type: 'color',
              default: '(none)',
            },
            {
              name: 'textOutline',
              description: 'Percentage Text Outline Color',
              type: 'color',
              default: '(none)',
            },
            {
              name: 'textAlignment',
              description: 'Percentage Text Alignment',
              type: 'UpperLeft | UpperCenter | UpperRight | MiddleLeft | MiddleCenter | MiddleRight | LowerLeft | LowerCenter | LowerRight',
              default: 'MiddleCenter',
            },
          ],
        },
      ],
    },
    {
      type: 'Input',
      items: [
        {
          tag: 'InputField',
          url: 'https://api.tabletopsimulator.com/ui/inputelements/#inputfield',
          attributes: [
            {
              name: 'onValueChanged',
              description:
                'Each time the text is changed, a Lua function with this name will be triggered.',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'onEndEdit',
              description:
                'When the input box is deselected, a Lua function with this name will be triggered.',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'text',
              description:
                'The string in the text box, if any. Is the value sent to onValueChanged’s or onEndEdit’s function.',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'placeholder',
              description: 'A string that is semi-visible when there is no text in the input.',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'interactable',
              type: 'bool',
              default: 'true',
            },
            {
              name: 'colors',
              type: 'colorBlock',
              default: '#FFFFFF|#FFFFFF|#C8C8C8|rgba(0.78,0.78,0.78,0.5)',
            },
            {
              name: 'lineType',
              type: 'SingleLine | MultiLineSubmit | MultiLineNewLine',
              default: 'SingleLine',
            },
            {
              name: 'characterValidation',
              type: 'None | Integer | Decimal | Alphanumeric | Name | EmailAddress',
              default: 'None',
            },
            {
              name: 'caretBlinkRate',
              type: 'float',
              default: '0.85',
            },
            {
              name: 'caretWidth',
              type: 'float',
              default: '1',
            },
            {
              name: 'caretColor',
              type: 'color',
              default: '#323232',
            },
            {
              name: 'selectionColor',
              type: 'color',
              default: 'rgba(0.65,0.8,1,0.75)',
            },
            {
              name: 'readOnly',
              type: 'bool',
              default: 'false',
            },
            {
              name: 'textColor',
              type: 'color',
              default: '#323232',
            },
            {
              name: 'characterLimit',
              type: 'int',
              default: '0 (no limit)',
            },
          ],
        },
        {
          tag: 'Button',
          url: 'https://api.tabletopsimulator.com/ui/inputelements/#button',
          attributes: [
            {
              name: 'onClick',
              description: 'When clicked, a Lua function with this name will be triggered.',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'interactable',
              type: 'bool',
              default: 'true',
            },
            {
              name: 'colors',
              type: 'colorBlock',
              default: '#FFFFFF|#FFFFFF|#C8C8C8|rgba(0.78,0.78,0.78,0.5)',
            },
            {
              name: 'textShadow',
              type: 'color',
              default: '(none)',
            },
            {
              name: 'textOutline',
              type: 'color',
              default: '(none)',
            },
            {
              name: 'textAlignment',
              type: 'UpperLeft | UpperCenter | UpperRight | MiddleLeft | MiddleCenter | MiddleRight | LowerLeft | LowerCenter | LowerRight',
              default: 'UpperLeft',
            },
            {
              name: 'icon',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'iconWidth',
              type: 'float',
              default: '(undocumented)',
            },
            {
              name: 'iconColor',
              type: 'color',
              default: '(undocumented)',
            },
            {
              name: 'iconAlignment',
              type: 'Left | Right',
              default: 'Left',
            },
            {
              name: 'padding',
              type: 'float float float float',
              default: '0 0 0 0',
            },
            {
              name: 'transition',
              type: 'None | ColorTint | SpriteSwap | Animation',
              default: 'ColorTint',
            },
            {
              name: 'highlightedSprite',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'pressedSprite',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'disabledSprite',
              type: 'string',
              default: '(none)',
            },
          ],
        },
        {
          tag: 'Toggle',
          url: 'https://api.tabletopsimulator.com/ui/inputelements/#toggle',
          attributes: [
            {
              name: 'onValueChanged',
              description: 'When toggled, a Lua function with this name will be triggered.',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'interactable',
              type: 'bool',
              default: 'true',
            },
            {
              name: 'textColor',
              type: 'color',
              default: '#000000',
            },
            {
              name: 'colors',
              type: 'colorBlock',
              default: '#FFFFFF|#FFFFFF|#C8C8C8|rgba(0.78,0.78,0.78,0.5)',
            },
            {
              name: 'isOn',
              description:
                'If the toggle is "on" or not. Is the value sent to onValueChanged’s function.',
              type: 'bool',
              default: 'false',
            },
            {
              name: 'toggleWidth',
              description: 'Sets the width in pixels of the internal check box',
              type: 'float',
              default: '20',
            },
            {
              name: 'toggleHeight',
              description: 'Sets the width in pixels of the internal check box',
              type: 'float',
              default: '20',
            },
          ],
        },
        {
          tag: 'ToggleButton',
          url: 'https://api.tabletopsimulator.com/ui/inputelements/#togglebutton',
          attributes: [
            {
              name: 'onValueChanged',
              description: 'When toggled, a Lua function with this name will be triggered.',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'interactable',
              type: 'bool',
              default: 'true',
            },
            {
              name: 'textColor',
              type: 'color',
              default: '#000000',
            },
            {
              name: 'colors',
              type: 'colorBlock',
              default: '#FFFFFF|#FFFFFF|#C8C8C8|rgba(0.78,0.78,0.78,0.5)',
            },
            {
              name: 'isOn',
              description:
                'If the toggle is "on" or not. Is the value sent to onValueChanged’s function.',
              type: 'bool',
              default: 'false',
            },
            {
              name: 'textShadow',
              type: 'color',
              default: '(none)',
            },
            {
              name: 'textOutline',
              type: 'color',
              default: '(none)',
            },
            {
              name: 'textAlignment',
              type: 'UpperLeft | UpperCenter | UpperRight | MiddleLeft | MiddleCenter | MiddleRight | LowerLeft | LowerCenter | LowerRight',
              default: 'UpperLeft',
            },
            {
              name: 'icon',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'iconWidth',
              type: 'float',
              default: '(undocumented)',
            },
            {
              name: 'iconColor',
              type: 'color',
              default: '(undocumented)',
            },
            {
              name: 'iconAlignment',
              type: 'Left | Right',
              default: 'Left',
            },
            {
              name: 'padding',
              type: 'float float float float',
              default: '0 0 0 0',
            },
          ],
        },
        {
          tag: 'ToggleGroup',
          url: 'https://api.tabletopsimulator.com/ui/inputelements/#togglegroup',
          attributes: [
            {
              name: 'allowSwitchOff',
              description:
                'If this is set to true, then the user may clear their selection from within the ToggleGroup by clicking on the selected Toggle.',
              type: 'bool',
              default: 'false',
            },
            {
              name: 'toggleBackgroundImage',
              description: 'Sets the default background image to use for nested Toggle elements.',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'toggleBackgroundColor',
              type: 'color',
              default: '#FFFFFF',
            },
            {
              name: 'toggleSelectedImage',
              description:
                'Sets the default image to use for selected (checked) nested Toggle elements.',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'toggleSelectedColor',
              type: 'color',
              default: '#FFFFFF',
            },
          ],
        },
        {
          tag: 'Slider',
          url: 'https://api.tabletopsimulator.com/ui/inputelements/#slider',
          attributes: [
            {
              name: 'onValueChanged',
              description:
                'When the slider is moved, a Lua function with this name will be triggered. (rapidly)',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'interactable',
              type: 'bool',
              default: 'true',
            },
            {
              name: 'colors',
              type: 'colorBlock',
              default: '#FFFFFF|#FFFFFF|#C8C8C8|rgba(0.78,0.78,0.78,0.5)',
            },
            {
              name: 'minValue',
              type: 'float',
              default: '0',
            },
            {
              name: 'maxValue',
              type: 'float',
              default: '1',
            },
            {
              name: 'value',
              description:
                'The value currently selected. Is the value sent to onValueChanged’s function.',
              type: 'float',
              default: '0',
            },
            {
              name: 'wholeNumbers',
              type: 'bool',
              default: 'false',
            },
            {
              name: 'direction',
              type: 'LeftToRight | RightToLeft | TopToBottom | BottomToTop',
              default: 'LeftToRight',
            },
            {
              name: 'backgroundColor',
              type: 'color',
              default: '(none)',
            },
            {
              name: 'fillColor',
              type: 'color',
              default: '(none)',
            },
            {
              name: 'fillImage',
              type: 'string',
              default: '(undocumented)',
            },
            {
              name: 'handleColor',
              type: 'color',
              default: '(none)',
            },
            {
              name: 'handleImage',
              type: 'string',
              default: '(undocumented)',
            },
          ],
        },
        {
          tag: 'Dropdown',
          url: 'https://api.tabletopsimulator.com/ui/inputelements/#dropdown',
          attributes: [
            {
              name: 'onValueChanged',
              description:
                'When an option is selected, a Lua function with this name will be triggered.',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'interactable',
              type: 'bool',
              default: 'true',
            },
            {
              name: 'textColor',
              type: 'color',
              default: '#000000',
            },
            {
              name: 'itemBackgroundColors',
              type: 'colorBlock',
              default: '#FFFFFF',
            },
            {
              name: 'itemTextColor',
              type: 'color',
              default: '#000000',
            },
            {
              name: 'checkColor',
              type: 'color',
              default: '#000000',
            },
            {
              name: 'checkImage',
              type: 'string',
              default: '(undocumented)',
            },
            {
              name: 'arrowColor',
              type: 'color',
              default: '#000000',
            },
            {
              name: 'arrowImage',
              type: 'string',
              default: '(undocumented)',
            },
            {
              name: 'dropdownBackgroundColor',
              type: 'color',
              default: '#000000',
            },
            {
              name: 'dropdownBackgroundImage',
              type: 'string',
              default: '(undocumented)',
            },
            {
              name: 'scrollbarColors',
              type: 'colorBlock',
              default: '(undocumented)',
            },
            {
              name: 'scrollbarImage',
              type: 'string',
              default: '(undocumented)',
            },
            {
              name: 'itemHeight',
              type: 'float',
              default: '(undocumented)',
            },
          ],
        },
      ],
    },
    {
      type: 'Layout/Grouping',
      items: [
        {
          tag: 'Panel',
          url: 'https://api.tabletopsimulator.com/ui/layoutgrouping/#panel',
          attributes: [
            {
              name: 'padding',
              description:
                'Specifies the padding for this panel. Please note that if padding is specified, the panel will function as a LayoutGroup (which it does not do by default).',
              type: 'float(left) float(right) float(top) float(bottom)',
              default: '(none)',
            },
          ],
        },
        {
          tag: 'HorizontalLayout',
          url: 'https://api.tabletopsimulator.com/ui/layoutgrouping/#horizontallayout',
          attributes: [
            {
              name: 'padding',
              type: 'float(left) float(right) float(top) float(bottom)',
              default: '0 0 0 0',
            },
            {
              name: 'spacing',
              description: 'Spacing between child elements.',
              type: 'float',
              default: '0',
            },
            {
              name: 'childAlignment',
              type: 'UpperLeft | UpperCenter | UpperRight | MiddleLeft | MiddleCenter | MiddleRight | LowerLeft | LowerCenter | LowerRight | UpperLeft',
              default: '(undocumented)',
            },
            {
              name: 'childForceExpandWidth',
              type: 'bool',
              default: 'true',
            },
            {
              name: 'childForceExpandHeight',
              type: 'bool',
              default: 'true',
            },
          ],
        },
        {
          tag: 'VerticalLayout',
          url: 'https://api.tabletopsimulator.com/ui/layoutgrouping/#verticallayout',
          attributes: [
            {
              name: 'padding',
              type: 'float(left) float(right) float(top) float(bottom)',
              default: '0 0 0 0',
            },
            {
              name: 'spacing',
              description: 'Spacing between child elements.',
              type: 'float',
              default: '0',
            },
            {
              name: 'childAlignment',
              type: 'UpperLeft | UpperCenter | UpperRight | MiddleLeft | MiddleCenter | MiddleRight | LowerLeft | LowerCenter | LowerRight | UpperLeft',
              default: '(undocumented)',
            },
            {
              name: 'childForceExpandWidth',
              type: 'bool',
              default: 'true',
            },
            {
              name: 'childForceExpandHeight',
              type: 'bool',
              default: 'true',
            },
          ],
        },
        {
          tag: 'GridLayout',
          url: 'https://api.tabletopsimulator.com/ui/layoutgrouping/#gridlayout',
          attributes: [
            {
              name: 'padding',
              type: 'float(left) float(right) float(top) float(bottom)',
              default: '0 0 0 0',
            },
            {
              name: 'spacing',
              description: 'Spacing between child elements.',
              type: 'float(x) float(y)',
              default: '0 0',
            },
            {
              name: 'cellSize',
              type: 'float(x) float(y)',
              default: '100 100',
            },
            {
              name: 'startCorner',
              type: 'UpperLeft | UpperRight | LowerLeft | LowerRight | UpperLeft',
              default: 'UpperLeft',
            },
            {
              name: 'startAxis',
              type: 'Horizontal | Vertical | Horizontal',
              default: 'Horizontal',
            },
            {
              name: 'childAlignment',
              type: 'UpperLeft | UpperCenter | UpperRight | MiddleLeft | MiddleCenter | MiddleRight | LowerLeft | LowerCenter | LowerRight | UpperLeft',
              default: 'UpperLeft',
            },
            {
              name: 'constraint',
              type: 'Flexible | FixedColumnCount | FixedRowCount | Flexible',
              default: 'Flexible',
            },
            {
              name: 'constraintCount',
              type: 'integer',
              default: '2',
            },
          ],
        },
        {
          tag: 'TableLayout',
          url: 'https://api.tabletopsimulator.com/ui/layoutgrouping/#tablelayout',
          attributes: [
            {
              name: 'padding',
              type: 'float(left) float(right) float(top) float(bottom)',
              default: '0 0 0 0',
            },
            {
              name: 'cellSpacing',
              description: 'Spacing between each cell.',
              type: 'float',
              default: '0',
            },
            {
              name: 'columnWidths',
              description:
                '(Optional) Explicitly set the width of each column. Use a value of 0 to auto-size a specific column.',
              type: "float list - e.g. '32 0 0 32'",
              default: '(none)',
            },
            {
              name: 'automaticallyAddColumns',
              description:
                'If more cells are added to a row than are accounted for by columnWidths, should this TableLayout automatically add one or more new auto-sized entries (0) to columnWidths?',
              type: 'bool',
              default: 'true',
            },
            {
              name: 'automaticallyRemoveEmptyColumns',
              description:
                "If there are more entries in columnWidths than there are cells in any row, should this TableLayout automatically remove entries from columnWidths until their are no 'empty' columns?",
              type: 'bool',
              default: 'true',
            },
            {
              name: 'autoCalculateHeight',
              description:
                'If set to true, then the height of this TableLayout will automatically be calculated as the sum of each rows preferredHeight value. This option cannot be used without explicitly sized rows.',
              type: 'bool',
              default: 'false',
            },
            {
              name: 'useGlobalCellPadding',
              description:
                "If set to true, then all cells will use this TableLayout's cellPadding value.",
              type: 'bool',
              default: 'true',
            },
            {
              name: 'cellPadding',
              description: 'Padding for each cell.',
              type: 'float(left) float(right) float(top) float(bottom)',
              default: '0 0 0 0',
            },
            {
              name: 'cellBackgroundImage',
              description: 'Image to use as the background for each cell.',
              type: 'string',
              default: '(undocumented)',
            },
            {
              name: 'cellBackgroundColor',
              description: 'Color for each cells background.',
              type: 'color',
              default: 'rgba(1,1,1,0.4)',
            },
            {
              name: 'rowBackgroundImage',
              description: 'Image to use as the background for each row.',
              type: 'string',
              default: '(undocumented)',
            },
            {
              name: 'rowBackgroundColor',
              description: 'Color to use for each rows background.',
              type: 'color',
              default: 'clear',
            },
          ],
        },
        {
          tag: 'Row',
          url: 'https://api.tabletopsimulator.com/ui/layoutgrouping/#row',
          attributes: [
            {
              name: 'preferredHeight',
              description:
                "Sets the height for this row. Use a value of '0' to specify that this row should be auto-sized.",
              type: 'float',
              default: '0',
            },
            {
              name: 'dontUseTableRowBackground',
              description:
                "If set to true, then this row will ignore the tables' rowBackgroundImage and rowBackgroundColor values, allowing you to override those values for this row.",
              type: 'bool',
              default: 'false',
            },
          ],
        },
        {
          tag: 'Cell',
          url: 'https://api.tabletopsimulator.com/ui/layoutgrouping/#cell',
          attributes: [
            {
              name: 'columnSpan',
              type: 'int',
              default: '1',
            },
            {
              name: 'dontUseTableCellBackground',
              description:
                "If set to true, then this cell will ignore the tables' cellBackgroundImage and values, allowing you to override those values for this cell.",
              type: 'bool',
              default: 'false',
            },
            {
              name: 'overrideGlobalCellPadding',
              description:
                "If set to true, then this cell will ignore the tables' cellPadding value, allowing you to set unique cell padding for this cell.",
              type: 'bool',
              default: 'false',
            },
            {
              name: 'padding',
              description:
                'Padding values to use for this cell if overrideGlobalCellPadding is set to true.',
              type: 'float(left) float(right) float(top) float(bottom)',
              default: '0 0 0 0',
            },
            {
              name: 'childForceExpandWidth',
              type: 'bool',
              default: 'true',
            },
            {
              name: 'childForceExpandHeight',
              type: 'bool',
              default: 'true',
            },
          ],
        },
        {
          tag: 'HorizontalScrollView',
          url: 'https://api.tabletopsimulator.com/ui/layoutgrouping/#horizontalscrollview',
          attributes: [
            {
              name: 'onValueChanged',
              description:
                'When a selection is made, its name is sent to a function with this name.',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'horizontal',
              type: 'bool',
              default: 'true',
            },
            {
              name: 'vertical',
              type: 'bool',
              default: 'false',
            },
            {
              name: 'movementType',
              type: 'Unrestricted | Elastic | Clamped',
              default: 'Unrestricted',
            },
            {
              name: 'elasticity',
              type: 'float',
              default: '0.1',
            },
            {
              name: 'inertia',
              type: 'bool',
              default: 'true',
            },
            {
              name: 'decelerationRate',
              type: 'float',
              default: '0.135',
            },
            {
              name: 'scrollSensitivity',
              type: 'float',
              default: '1',
            },
            {
              name: 'horizontalScrollbarVisibility',
              type: 'Permanent | AutoHide | AutoHideAndExpandViewport',
              default: 'AutoHide',
            },
            {
              name: 'verticalScrollbarVisibility',
              type: 'Permanent | AutoHide | AutoHideAndExpandViewport',
              default: '(none)',
            },
            {
              name: 'noScrollbars',
              description: 'If set to true, then this scroll view will have no visible scrollbars.',
              type: 'bool',
              default: 'false',
            },
            {
              name: 'scrollbarBackgroundColor',
              type: 'color',
              default: '#FFFFFF',
            },
            {
              name: 'scrollbarColors',
              type: 'color | color | color | color',
              default: '#FFFFFF|#FFFFFF|#C8C8C8|rgba(0.78,0.78,0.78,0.5)',
            },
            {
              name: 'scrollbarImage',
              type: 'string',
              default: '(undocumented)',
            },
          ],
        },
        {
          tag: 'VerticalScrollView',
          url: 'https://api.tabletopsimulator.com/ui/layoutgrouping/#verticalscrollview',
          attributes: [
            {
              name: 'onValueChanged',
              description:
                'When a selection is made, its name is sent to a function with this name.',
              type: 'string',
              default: '(none)',
            },
            {
              name: 'horizontal',
              type: 'bool',
              default: 'false',
            },
            {
              name: 'vertical',
              type: 'bool',
              default: 'true',
            },
            {
              name: 'movementType',
              type: 'Unrestricted | Elastic | Clamped',
              default: 'Clamped',
            },
            {
              name: 'elasticity',
              type: 'float',
              default: '0.1',
            },
            {
              name: 'inertia',
              type: 'bool',
              default: 'true',
            },
            {
              name: 'decelerationRate',
              type: 'float',
              default: '0.135',
            },
            {
              name: 'scrollSensitivity',
              type: 'float',
              default: '1',
            },
            {
              name: 'horizontalScrollbarVisibility',
              type: 'Permanent | AutoHide | AutoHideAndExpandViewport',
              default: '(none)',
            },
            {
              name: 'verticalScrollbarVisibility',
              type: 'Permanent | AutoHide | AutoHideAndExpandViewport',
              default: 'AutoHide',
            },
            {
              name: 'noScrollbars',
              description: 'If set to true, then this scroll view will have no visible scrollbars.',
              type: 'bool',
              default: 'false',
            },
            {
              name: 'scrollbarBackgroundColor',
              type: 'color',
              default: '#FFFFFF',
            },
            {
              name: 'scrollbarColors',
              type: 'color | color | color | color',
              default: '#FFFFFF|#FFFFFF|#C8C8C8|rgba(0.78,0.78,0.78,0.5)',
            },
            {
              name: 'scrollbarImage',
              type: 'string',
              default: '(undocumented)',
            },
          ],
        },
      ],
    },
  ],
};
