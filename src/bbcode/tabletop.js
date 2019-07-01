'use strict'

const BBCode = require('./index.js')

class Stack {
  constructor () {
    this._count = 0
    this._storage = {}
  }

  push (value) {
    this._storage[this._count] = value
    this._count++
  }

  pop () {
    if (this._count === 0) return undefined
    this._count--
    let result = this._storage[this._count]
    delete this._storage[this._count]
    return result
  }

  size () { return this._count }
}

exports.parse = function (input) {
  const stack = new Stack()
  let match
  let html = new BBCode({
    '\\[b\\](.+?)\\[/b\\]': '<strong>$1</strong>',
    '\\[i\\](.+?)\\[/i\\]': '<em>$1</em>',
    '\\[u\\](.+?)\\[/u\\]': '<u>$1</u>',
    '\\[s\\](.+?)\\[/s\\]': '<span style="text-decoration: line-through">$1</span>',
    '\\[sub\\](.+?)\\[/sub\\]': '<sub>$1</sup>',
    '\\[sup\\](.+?)\\[/sup\\]': '<sup>$1</sub>',
    '\\n': '<br>'
  }).parse(input)
  // While the string contains [hexColor] or [-]
  while ((match = RegExp('\\[([a-fA-F|0-9]{6})\\]|\\[-\\]', 'im').exec(html)) !== null) {
    if (match[1]) { // Matched a color
      stack.push({ color: match[1], loc: match.index }) // Store color and pos
      // Remove it from string
      html = [
        html.slice(0, match.index),
        html.slice(match.index + 8)
      ].join('')
    } else { // Matched a stop
      // Replace stop at matched pos
      html = [
        html.slice(0, match.index),
        '</span>',
        html.slice(match.index + 3)
      ].join('')
      // Add Color tag at matching color's stored position
      let hexMatch = stack.pop()
      html = [
        html.slice(0, hexMatch.loc),
        '<span style=color:#' + hexMatch.color + '>',
        html.slice(hexMatch.loc)
      ].join('')
    }
  }
  return html
}
