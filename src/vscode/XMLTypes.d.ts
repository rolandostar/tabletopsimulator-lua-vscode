export interface IAttribute {
  name: string
  description?: string
  type: string
  default: string
}

export interface IElement {
  tag: string
  url: string
  attributes: IAttribute[]
}

export interface IElementType {
  type: string
  items: IElement[]
}

export interface IAttributeType {
  type: string
  items: IAttribute[]
}

export interface IXMLCompletionData {
  version: string
  attributeTypes: IAttributeType[]
  elementTypes: IElementType[]
}