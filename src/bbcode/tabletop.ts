import BBCodeParser from './parser';

const { escape } = require('html-escaper');

class Stack {
  private count: number;

  private storage: any;

  public constructor() {
    this.count = 0;
    this.storage = {};
  }

  public push(value: { color: string, loc: number }) {
    this.storage[this.count] = value;
    this.count += 1;
  }

  public pop() {
    if (this.count === 0) return undefined;
    this.count -= 1;
    const result = this.storage[this.count];
    delete this.storage[this.count];
    return result;
  }

  public size() { return this.count; }
}

export default function parse(input: string) {
  const stack = new Stack();
  let match;
  let html = new BBCodeParser({
    '\\[b\\](.+?)\\[/b\\]': '<span class="bold">$1</span>',
    '\\[i\\](.+?)\\[/i\\]': '<span class="italic">$1</span>',
    '\\[u\\](.+?)\\[/u\\]': '<span class="underline">$1</span>',
    '\\[s\\](.+?)\\[/s\\]': '<span class="lineThrough">$1</span>',
    '\\[sub\\](.+?)\\[/sub\\]': '<span class="sub">$1</span>',
    '\\[sup\\](.+?)\\[/sup\\]': '<span class="sup">$1</span>',
    '\\n': '<br>',
  }).parse(escape(input));
  // While the string contains [hexColor] or [-]
  // eslint-disable-next-line no-cond-assign
  while ((match = RegExp('\\[([a-fA-F|0-9]{6})\\]|\\[-\\]', 'im').exec(html)) !== null) {
    if (match[1]) { // Matched a color
      stack.push({ color: match[1], loc: match.index }); // Store color and pos
      // Remove it from string
      html = [
        html.slice(0, match.index),
        html.slice(match.index + 8),
      ].join('');
    } else { // Matched a stop
      // Replace stop at matched pos
      html = [
        html.slice(0, match.index),
        '</span>',
        html.slice(match.index + 3),
      ].join('');
      // Add Color tag at matching color's stored position
      const hexMatch = stack.pop();
      html = [
        html.slice(0, hexMatch.loc),
        `<span style=color:#${hexMatch.color}>`,
        html.slice(hexMatch.loc),
      ].join('');
    }
  }
  while (stack.size() > 0) {
    // Add closing span at the end
    html = [html, '</span>'].join('');
    // Add Color tag at matching color's stored position
    const hexMatch = stack.pop();
    html = [
      html.slice(0, hexMatch.loc),
      `<span style=color:#${hexMatch.color}>`,
      html.slice(hexMatch.loc),
    ].join('');
  }
  return html;
}
