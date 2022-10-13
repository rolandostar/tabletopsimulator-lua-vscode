import ExternalEditorApi, { JsonMessage, Options } from '@matanlurey/tts-editor';
import { Socket } from 'net';

export default class CustomExternalEditorApi extends ExternalEditorApi {
  constructor(options: Options = {}) {
    super(options);
    // Overwrite the private send method
    (this as any).send = this.customSend;
  }

  protected customSend<T extends number>(message: JsonMessage<T>): Promise<void> {
    console.log('SENDIIIIIIIIIING');
    const client = new Socket();
    return new Promise((resolve, reject) => {
      client.once('error', reject);
      client.connect(39999, '127.0.0.1', () => {
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
