/**
 * @file Table Generator
 * This file generates an html table based on behaviour found in the api.json file.
 * It is used to generate the tables in the documentation section of autocompletion items
 */

/* eslint-disable no-multi-spaces */
/* eslint-disable @typescript-eslint/key-spacing */
// Acording to: https://api.tabletopsimulator.com/types/#common-standards
enum Styles {
  nil =    'color:#fff;background-color:#676666;',
  int =    'color:#000;background-color:#d48e87;',
  float =  'color:#000;background-color:#d48e87;',
  bool =   'color:#000;background-color:#be9fad;',
  string = 'color:#000;background-color:#acc39b;',
  table =  'color:#000;background-color:#c2c2c2;',
  vector = 'color:#000;background-color:#f4d29a;',
  color =  'color:#000;background-color:#e2bae0;',
  func =   'color:#fff;background-color:#de4816;',
  object = 'color:#000;background-color:#b1bfe0;',
  player = 'color:#000;background-color:#b5e1e5;',
  var =    'color:#000;background-color:#e0e270;' // Unused in parameters
}

interface DocType { display: string, style: Styles }

// Strings extracted from api.json
export const StringToType: Record<string, DocType> = {
  string:      { style: Styles.string, display: 'string' },
  function:    { style: Styles.func,   display: 'func' },
  bool:        { style: Styles.bool,   display: 'bool' },
  Color:       { style: Styles.color,  display: 'color' },
  float:       { style: Styles.float,  display: 'float' },
  table:       { style: Styles.table,  display: 'table' },
  Object:      { style: Styles.object, display: 'object' },
  any:         { style: Styles.nil,    display: 'any' },
  int:         { style: Styles.int,    display: 'int' },
  Player:      { style: Styles.player, display: 'player' },
  coroutine:   { style: Styles.func,   display: 'coroutine' },
  Action:      { style: Styles.var,    display: 'action' },
  Vector:      { style: Styles.vector, display: 'vector' },
  time:        { style: Styles.var,    display: 'time' },
  // Non-Param Types
  void:        { style: Styles.nil,    display: 'void' },
  number:      { style: Styles.int,    display: 'number' },
  thread:      { style: Styles.func,   display: 'thread' },
  GameObject:  { style: Styles.object, display: 'GameObject' },
  Component:   { style: Styles.object, display: 'Component' },
  captures:    { style: Styles.var,    display: 'captures' },
  class:       { style: Styles.var,    display: 'class' },
  AssetBundle: { style: Styles.var,    display: 'AssetBundle' },
  Clock:       { style: Styles.var,    display: 'Clock' },
  Counter:     { style: Styles.var,    display: 'Counter' },
  LayoutZone:  { style: Styles.var,    display: 'LayoutZone' },
  RPGFigurine: { style: Styles.var,    display: 'RPGFigurine' },
  TextTool:    { style: Styles.var,    display: 'TextTool' }
}

export class TableGenerator {
  private readonly padding = 2
  private html = '<table><tbody>'

  public addRow (type: string, name?: string, description?: string): this {
    const localType = StringToType[type] ?? { style: Styles.var, display: type }
    // Bubble up to User
    if (localType === undefined) { throw new Error(`Type ${type} not found`) }
    // pad on both sides with &nbsp; according to pad prop localType.display should be centered
    this.html += `<tr${description !== undefined ? ` title="${description}"` : ''}><td align="right"><span style="${localType.style}">${'&nbsp;'.repeat(this.padding)}${localType.display}${'&nbsp;'.repeat(this.padding)}</span></td>`
    if (name !== undefined) { this.html += `<td><code>${name}</code>${description !== undefined ? '$(info)' : ''}</td>` }
    this.html += '</tr>'
    return this
  }

  public toString (): string {
    return this.html + '</tbody></table>'
  }
}
