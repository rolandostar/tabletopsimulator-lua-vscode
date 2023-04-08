import getConfig from '@utils/getConfig'
import {
  type CancellationToken, type CompletionContext, CompletionItem, CompletionList,
  type Position, type TextDocument, type CompletionItemProvider, CompletionItemKind, MarkdownString
} from 'vscode'
import * as apiManager from './apiManager'

export default class LuaCompletionProvider implements CompletionItemProvider {
  private luaCompletion: apiManager.LuaCompletion | undefined

  public async preload (): Promise<void> {
    const latestApi = await apiManager.loadApi().catch(async err => {
      // Unable to read from disk, let's download it instead
      if (err.code !== 'FileNotFound') throw err
      return await apiManager.downloadApi()
    })
    this.luaCompletion = new apiManager.LuaCompletion(latestApi)
  }

  public async provideCompletionItems (
    document: TextDocument,
    position: Position,
    _token: CancellationToken,
    context: CompletionContext
  ): Promise<CompletionItem[] | CompletionList> {
    if (!getConfig<boolean>('autocompletion.luaEnabled')) return []
    const range = document.getWordRangeAtPosition(position)
    const text = document.getText(range)
    console.log(text)
    const myCompletion = new CompletionItem({
      label: 'head',
      description: 'WebRequest',
      detail: '(url, callback_function)'
    })
    myCompletion.kind = CompletionItemKind.Method
    const md = new MarkdownString('<p>Performs a HTTP HEAD request.</p>')
    md.value += `Receives parameters:
    <table>
    <thead>
      <tr>
        <td><span style="color:#000;background-color:#ACC39B;">&nbsp;string&nbsp;</span></td>
        <td><code>url</code></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span style="color:#FFF;background-color:#DE4816;">&nbsp;&nbsp;func&nbsp;&nbsp;</span></td>
        <td><code>callback_function</code></td>
      </tr>
    </tbody>
    </table>`
    // md.appendCodeblock('head(url: string, callback_function: function)', 'typescript')
    md.value += `<br/>Returns table:
    <table>
  <tbody>
    <tr title="Download percentage, represented as a number in the range 0-1.">
      <td><span style="color:#000;background-color:#BE9FAD;">&nbsp;&nbsp;bool&nbsp;&nbsp;</span></td>
      <td><code>download_progress</code>$(info)</td>
    </tr>
    <tr title="Reason why the request failed to complete.&#013;If the server responds with a HTTP status code that represents a HTTP error (4xx/5xx), this is not considered a request error.">
      <td><span style="color:#000;background-color:#ACC39B;">&nbsp;string&nbsp;</span></td>
      <td><code>error</code>$(info)</td>
    </tr>
    <tr title="If the request completed or failed. If the request failed, is_error will be set.">
      <td><span style="color:#000;background-color:#BE9FAD;">&nbsp;&nbsp;bool&nbsp;&nbsp;</span></td>
      <td><code>is_done</code>$(info)</td>
    </tr>
  </tbody>
  </table>
  `
    md.value += '<br /><a href="https://api.tabletopsimulator.com/webrequest/manager/#head">Official Documentation $(link-external)</a>'
    md.isTrusted = true
    md.supportHtml = true
    md.supportThemeIcons = true
    myCompletion.documentation = md

    return new CompletionList([
      ...this.luaCompletion?.completionStore.WebRequest ?? [],
      myCompletion
    ], false)
  }
}
