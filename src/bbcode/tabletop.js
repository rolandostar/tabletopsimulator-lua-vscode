const BBCode = require('./index.js');

module.exports = new BBCode({
  '\\[(.+?)\\](.+?)\\[-\\]': '<span style="color:#$1">$2</span>',
  '\\[b\\](.+?)\\[/b\\]': '<strong>$1</strong>',
  '\\[i\\](.+?)\\[/i\\]': '<em>$1</em>',
  '\\[u\\](.+?)\\[/u\\]': '<u>$1</u>',
  '\\[s\\](.+?)\\[/s\\]': '<span style="text-decoration: line-through">$1</span>',
  '\\[sub\\](.+?)\\[/sub\\]': '<sub>$1</sup>',
  '\\[sup\\](.+?)\\[/sup\\]': '<sup>$1</sub>',
  '\\n': '<br>'
});
