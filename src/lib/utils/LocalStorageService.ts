import { FileManager } from '@/vscode/fileManager'
import { Uri, type Memento, type ExtensionContext } from 'vscode'

let kvStorage: Memento | undefined
let storageUri: Uri | undefined

/**
 * Sets the storage to be used by the service
 * @param newStorage The storage to be used by the service
 */
export function setStorage (KVStorage: Memento, GlobalStorageUri: Uri): void {
  kvStorage = KVStorage
  storageUri = GlobalStorageUri
  console.debug('Storage Uri: ' + storageUri.fsPath)
}

/**
 * Gets the value of a key
 * @param key Key of element to be found
 * @returns The value of the key, or undefined if it doesn't exist
 */
export function get<T> (key: string): T | undefined {
  if (kvStorage == null) throw new Error('Storage not set when trying to get key')
  return kvStorage.get<T>(key)
}

/**
 * Sets a key with a value
 * @param key Key of element to be set
 * @param value Value to be set
 * @returns A promise that resolves when the operation is complete
 */
export async function set<T> (key: string, value: T): Promise<void> {
  if (kvStorage == null) throw new Error('Storage not set when trying to set key')
  await Promise.resolve(kvStorage.update(key, value))
}

/**
 * Updates a key with a value, or creates it if it doesn't exist
 * @param key The key to be upserted
 * @param value The value to be upserted
 * @returns The current value of the key after the operation
 */
export async function upsert<T> (key: string, value: T): Promise<T> {
  if (kvStorage == null) throw new Error('Storage not set when trying to upsert key')
  const currentValue = kvStorage.get<T>(key, value)
  await kvStorage.update(key, currentValue)
  return currentValue
}

/**
 * Gets the value of a key, or sets it if it is empty
 * @param key Key of element to be found or created if empty
 * @param value Value to be set if key is empty
 * @returns The current value of the key, or the value that was set if it was empty
 */
export function querySet<T> (key: string, value: T): T {
  if (kvStorage == null) throw new Error('Storage not set when trying to query and set key')
  const current = kvStorage.get<T>(key)
  const wasDefined = current !== undefined
  if (!wasDefined) void kvStorage.update(key, value)
  return wasDefined ? current : value
}

/**
 * Deletes a key
 * @param key Key of element to be deleted
 * @returns A promise that resolves when the operation is complete
 */
export async function clear (key: string): Promise<void> {
  if (kvStorage == null) throw new Error('Storage not set when trying to clear key')
  await Promise.resolve(kvStorage.update(key, undefined))
}

/**
 * Writes a file to extension's storage directory
 * See {@link ExtensionContext.storageUri storageUri} for more information
 * @param path Path of file to be written, starting at storageUri
 * @param content Content to be written to file
 */
export async function write (path: string, content: string): Promise<void> {
  if (storageUri == null) throw new Error('Storage not set when trying to write file')
  await new FileManager(Uri.joinPath(storageUri, path)).write(content)
}

/**
 * Reads a file from extension's storage directory
 * @param path Path of file to be read, starting at storageUri
 * @returns The content of the file
 */
export async function read (path: string): Promise<string> {
  if (storageUri == null) throw new Error('Storage not set when trying to read file')
  return await new FileManager(Uri.joinPath(storageUri, path)).read()
}

/**
 * Erases a file from extension's storage directory
 * @param path Path of file to be erased, starting at storageUri
 */
export async function erase (path: string): Promise<void> {
  if (storageUri == null) throw new Error('Storage not set when trying to erase file')
  await new FileManager(Uri.joinPath(storageUri, path)).erase()
}
