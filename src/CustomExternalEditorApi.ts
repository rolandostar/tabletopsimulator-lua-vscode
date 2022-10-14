import ExternalEditorApi, { JsonMessage, Options } from '@matanlurey/tts-editor';
import { AddressInfo, Socket } from 'net';
import { handleGameNotRunning, handleMultipleInstances } from './utils/errorHandling';

export default class CustomExternalEditorApi extends ExternalEditorApi {
  constructor(options: Options = {}) {
    super(options);
    this.server.on('connection', (socket) => {
      const chunks: Buffer[] = [];
      socket.on('data', (data: Buffer) => {
        chunks.push(data);
      });
      socket.on('end', () => {
        this.onDataReceived(Buffer.concat(chunks).toString('utf-8'));
      });
    });
  }

  /**
   * Listens for incoming connections.
   *
   * Returns the port being listened on, if available.
   */
  public listen(): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
      this.server.once('error', reject).listen(this.serverPort, '127.0.0.1', () => {
        const address = this.server.address() as AddressInfo | null;
        if (address) {
          resolve(address.port);
        } else {
          resolve(undefined);
        }
      });
    });
  }

  protected async send<T extends number>(message: JsonMessage<T>): Promise<void> {
    const client = new Socket();
    if (!this.server.listening) await this.listen();
    return new Promise<void>((resolve, reject) => {
      client.once('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') handleMultipleInstances();
        if (err.code === 'ECONNREFUSED') handleGameNotRunning();
        else console.error('[TTSLua] Unexpected Server Error:', err);
        reject();
      });
      client.connect(this.clientPort, '127.0.0.1', () => {
        client.write(JSON.stringify(message), (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
          client.destroy();
        });
      });
    });
  }
}
