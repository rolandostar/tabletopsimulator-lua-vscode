/**
 * @file Custom External Editor API
 * This file contains the API for the external editor. It is used to communicate with the game.
 * It is a modified version of the original API, which is located in the @matanlurey/tts-editor package.
 * I've added some error handling to make it easier to debug when things are going wrong.
 */

import getConfig from '@/lib/utils/getConfig'
import { handleMultipleInstances, handleGameNotRunning } from '@/vscode/errorHandler'
import ExternalEditorApi, { type JsonMessage, type Options } from '@matanlurey/tts-editor'
import { Socket } from 'net'
// import { handleGameNotRunning, handleMultipleInstances } from '../utils/errorHandling';

export default class CustomExternalEditorApi extends ExternalEditorApi {
  constructor (options: Options = {}) {
    super(options)
    this.server.on('connection', socket => {
      const chunks: Buffer[] = []
      socket.on('data', (data: Buffer) => { chunks.push(data) })
      socket.on('end', () => { this.onDataReceived(Buffer.concat(chunks).toString('utf-8')) })
    })
  }

  /**
   * Listens for incoming connections.
   *
   * Returns the port being listened on, if available.
   */
  public async listen (): Promise<number | undefined> {
    // return await new Promise((resolve, reject) => {
    //   this.server.once('error', reject).listen(this.serverPort, '127.0.0.1', () => {
    //     const address = this.server.address() as AddressInfo | null
    //     if (address != null) {
    //       resolve(address.port)
    //     } else {
    //       resolve(undefined)
    //     }
    //   })
    // })
    this.server.listen(this.serverPort, getConfig('misc.host'))
    const address = this.server.address()
    return address != null && typeof address !== 'string' ? address.port : undefined
  }

  protected async send<T extends number>(message: JsonMessage<T>): Promise<void> {
    const client = new Socket()
    if (!this.server.listening) { await this.listen() }
    await new Promise<void>((resolve, reject) => {
      client.once('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') { handleMultipleInstances() }
        if (err.code === 'ECONNREFUSED') { handleGameNotRunning() }
        console.error('[TTSLua] Unexpected Server Error:', err)
        reject(err)
      })
      client.connect(this.clientPort, getConfig('misc.host'), () => {
        client.write(JSON.stringify(message), error => {
          if (error != null) {
            reject(error)
          } else {
            resolve()
          }
          client.destroy()
        })
      })
    })
  }
}
