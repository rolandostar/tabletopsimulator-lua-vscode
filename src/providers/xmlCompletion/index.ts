import { MarkdownString, CompletionItem, SnippetString } from 'vscode'

interface Attribute {
  name: string
  type: 'string' | 'bool' | 'float' | 'color' | 'enum' | 'colorBlock'
  description?: string
  default?: string
  values?: string[]
}

interface Element {
  name: string
  description: string
  url: string
  attributes: Attribute[]
}

interface XMLAPI {
  elements: Element[]
  attributes: any
}

export class XMLCompletion {
  public readonly elementStore: CompletionItem[] = []
  public readonly attributeStore = new Map<string, CompletionItem[]>()

  constructor (public api: XMLAPI) {
    for (const element of api.elements) {
      this.elementStore.push(this.addElement(element))
      this.attributeStore.set(element.name, this.addAttributes(element))
    }
  }

  private addElement (elem: Element): CompletionItem {
    const cItem = new CompletionItem({
      label: elem.name,
      description: 'Element'
    })
    const docString = new MarkdownString(`<p>${elem.description}</p><p><a href="${elem.url}">Official Documentation $(link-external)</a></p>`, true)
    docString.isTrusted = true
    docString.supportHtml = true
    cItem.documentation = docString
    cItem.insertText = new SnippetString(`<${elem.name} $1>$0</${elem.name}>`)
    return cItem
  }

  private addAttributes ({ name, attributes: attrs }: Element): CompletionItem[] {
    const cItems: CompletionItem[] = []
    for (const attr of attrs) {
      const cItem = new CompletionItem({
        label: attr.name,
        description: attr.type
      })
      cItem.detail = name
      const docString = new MarkdownString('', true)
      docString.isTrusted = true
      docString.supportHtml = true
      if (attr.description !== undefined) docString.value += `<p>${attr.description}</p>`
      if (attr.default !== undefined) docString.value += `<p>Default: ${attr.default}</p>`
      if (attr.values !== undefined) {
        docString.value += '<p>Values:</p>'
        for (const value of attr.values) {
          docString.value += `<p>${value}</p>`
        }
      }
      cItem.documentation = docString
      cItem.insertText = new SnippetString(attr.name + '="$0"')
      cItems.push(cItem)
    }
    return cItems
  }
}
