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

// Strings extracted from api.json
export const StringToType: Record<string, { display: string, style: Styles }> = {
  string:    { style: Styles.string, display: '&nbsp;string&nbsp;' },
  function:  { style: Styles.func,   display: '&nbsp;&nbsp;func&nbsp;&nbsp;' },
  bool:      { style: Styles.bool,   display: '&nbsp;&nbsp;bool&nbsp;&nbsp;' },
  Color:     { style: Styles.color,  display: '&nbsp;&nbsp;color&nbsp;&nbsp;' },
  float:     { style: Styles.float,  display: '&nbsp;&nbsp;float&nbsp;&nbsp;' },
  table:     { style: Styles.table,  display: '&nbsp;&nbsp;table&nbsp;' },
  Object:    { style: Styles.object, display: '&nbsp;object&nbsp;' },
  any:       { style: Styles.nil,    display: '&nbsp;&nbsp;&nbsp;any&nbsp;&nbsp;&nbsp;' },
  int:       { style: Styles.int,    display: '&nbsp;&nbsp;&nbsp;&nbsp;int&nbsp;&nbsp;&nbsp;&nbsp;' },
  Player:    { style: Styles.player, display: '&nbsp;player&nbsp;' },
  coroutine: { style: Styles.func,   display: 'coroutine' },
  Action:    { style: Styles.var,    display: '&nbsp;action&nbsp;' },
  Vector:    { style: Styles.vector, display: '&nbsp;vector&nbsp;' },
  time:      { style: Styles.var,    display: '&nbsp;&nbsp;time&nbsp;&nbsp;' },
  // Non-Param Types
  void:      { style: Styles.nil,    display: '&nbsp;&nbsp;void&nbsp;&nbsp;' },
  number:    { style: Styles.int,    display: '&nbsp;number&nbsp;' },
  thread:    { style: Styles.func,    display: '&nbsp;thread&nbsp;' },
  GameObject: { style: Styles.object, display: 'GameObject' },
  Component: { style: Styles.object, display: 'Component' },
  captures:  { style: Styles.var,    display: 'captures' }
}

export class TableGenerator {
  private html = '<table><tbody>'

  public addRow (type: string, name?: string, description?: string): TableGenerator {
    const localType = StringToType[type] ?? { display: type, style: Styles.var }
    // pad on both sides with &nbsp; until 8 characters, localType.display should be centered
    this.html += `<tr${description !== undefined ? ` title="${description}"` : ''}><td><span style="${localType.style}">${localType.display}</span></td>`
    if (name !== undefined) { this.html += `<td><code>${name}</code>${description !== undefined ? '$(info)' : ''}</td>` }
    this.html += '</tr>'
    return this
  }

  public toString (): string {
    return this.html + '</tbody></table>'
  }
}
