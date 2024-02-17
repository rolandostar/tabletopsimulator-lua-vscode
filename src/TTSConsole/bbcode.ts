import { escape } from 'html-escaper'
import { text } from 'stream/consumers'

interface StackItem { color: string, loc: number }

const bbCodes = {
  '\\[b\\](.+?)\\[/b\\]': '<span class="bold">$1</span>',
  '\\[i\\](.+?)\\[/i\\]': '<span class="italic">$1</span>',
  '\\[u\\](.+?)\\[/u\\]': '<span class="underline">$1</span>',
  '\\[s\\](.+?)\\[/s\\]': '<span class="lineThrough">$1</span>',
  '\\[sub\\](.+?)\\[/sub\\]': '<span class="sub">$1</span>',
  '\\[sup\\](.+?)\\[/sup\\]': '<span class="sup">$1</span>',
  '\\n': '<br>'
}

// We store the regex and replacement for each bbCode at import time to avoid recompiling the regexes
// every time the parse function is called
const regexCodes = Object.keys(bbCodes).map((regexString: string) => ({
  regexp: new RegExp(regexString, 'igm'),
  replacement: bbCodes[regexString as keyof typeof bbCodes]
}))

/**
 * Parses Known BBCodes into HTML (No colors, those are handled separately in parse function)
 * @param text The BBCode to parse
 * @returns The HTML representation of the BBCode
 */
const bbCodeParse = (text: string): string =>
  regexCodes.reduce((t, code) => t.replace(code.regexp, code.replacement), text)

/**
 * Simple helper function to remove a match from a string
 * @param input string to remove match from
 * @param regMatch regex match to remove
 * @param insertText optional text to insert in place of the match
 * @returns the modified string
 */
const removeMatch = (input: string, regMatch: RegExpMatchArray, insertText?: string): string => {
  if (regMatch.index === undefined) return input
  return [
    input.slice(0, regMatch.index),
    insertText ?? '',
    input.slice(regMatch.index + regMatch[0].length)
  ].join('')
}

/**
 * Inserts a color span tag at the location of the hexMatch
 * @param input the string to insert the color tag into
 * @param hexMatch the hex color match to insert
 * @returns the modified string
 */
const insertColor = (input: string, hexMatch: StackItem): string => {
  return [
    input.slice(0, hexMatch.loc),
    `<span style=color:#${hexMatch.color}>`,
    input.slice(hexMatch.loc)
  ].join('')
}

/**
 * Parses the input string and returns the HTML representation
 * @param input The string to parse
 * @returns The HTML representation of the input
 */
export default function parse (input: string): string {
  // First we direct replace all known BBCode with HTML
  let html = bbCodeParse(escape(input))
  // Then we do color, find all instances of [hexColor] or [-]
  const pattern = /\[([0-9a-fA-F]{6})\]|\[-\]/g
  const stack = Array<StackItem>()
  let match = pattern.exec(html)
  while (match?.index !== undefined) {
    if (match[1] !== undefined) {
      // Matched a color, store the value and its position
      stack.push({ color: match[1], loc: match.index })
      // Remove it from string
      html = removeMatch(html, match)
    } else {
      // Matched a stop, replace it with a closing span tag
      html = removeMatch(html, match, '</span>')
      // Add Color tag at matching color's stored position
      if (stack.length > 0) {
        const hexMatch = stack.pop()
        if (hexMatch !== undefined) html = insertColor(html, hexMatch)
      }
    }
    match = pattern.exec(html)
  }
  // After all matches are processed, add closing span tags for any remaining colors
  for (const hexMatch of stack) {
    // Add closing span at the end
    html = [html, '</span>'].join('')
    if (hexMatch !== undefined) html = insertColor(html, hexMatch)
  }
  return html
}
