import { type Memento } from 'vscode'

let storage: Memento | undefined

/**
 * Sets the storage to be used by the service
 * @param newStorage The storage to be used by the service
 */
export function setLocalStorage (newStorage: Memento): void {
  storage = newStorage
}

/**
 * Gets the value of a key
 * @param key Key of element to be found
 * @returns The value of the key, or undefined if it doesn't exist
 */
export function get<T> (key: string): T | undefined {
  if (storage == null) throw new Error('Storage not set when trying to get key')
  return storage.get<T>(key)
}

/**
 * Sets a key with a value
 * @param key Key of element to be set
 * @param value Value to be set
 * @returns A promise that resolves when the operation is complete
 */
export async function set<T> (key: string, value: T): Promise<void> {
  if (storage == null) throw new Error('Storage not set when trying to set key')
  await Promise.resolve(storage.update(key, value))
}

/**
 * Updates a key with a value, or creates it if it doesn't exist
 * @param key The key to be upserted
 * @param value The value to be upserted
 * @returns The current value of the key after the operation
 */
export async function upsert<T> (key: string, value: T): Promise<T> {
  if (storage == null) throw new Error('Storage not set when trying to upsert key')
  const currentValue = storage.get<T>(key, value)
  await storage.update(key, currentValue)
  return currentValue
}

/**
 * Gets the value of a key, or sets it if it is empty
 * @param key Key of element to be found or created if empty
 * @param value Value to be set if key is empty
 * @returns The current value of the key, or the value that was set if it was empty
 */
export function querySet<T> (key: string, value: T): T {
  if (storage == null) throw new Error('Storage not set when trying to query and set key')
  const current = storage.get<T>(key)
  const wasDefined = current !== undefined
  if (!wasDefined) void storage.update(key, value)
  return wasDefined ? current : value
}

/**
 * Deletes a key
 * @param key Key of element to be deleted
 * @returns A promise that resolves when the operation is complete
 */
export async function del (key: string): Promise<void> {
  if (storage == null) throw new Error('Storage not set when trying to delete key')
  await Promise.resolve(storage.update(key, undefined))
}
