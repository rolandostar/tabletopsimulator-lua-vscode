import { Memento } from 'vscode';

export default class LocalStorageService {
  public static storage: Memento | undefined;
  public static getValue<T>(key: string): T | undefined {
    if (!LocalStorageService.storage) throw new Error('Storage not set');
    return LocalStorageService.storage.get<T>(key);
  }

  public static setValue<T>(key: string, value: T) {
    if (!LocalStorageService.storage) throw new Error('Storage not set');
    return LocalStorageService.storage.update(key, value);
  }

  public static upsertValue<T>(key: string, value: T) {
    if (!LocalStorageService.storage) throw new Error('Storage not set');
    const currentValue = LocalStorageService.storage.get<T>(key, value);
    LocalStorageService.storage.update(key, currentValue);
    return currentValue;
  }

  public static getOrSet<T>(key: string, value: T) {
    if (!LocalStorageService.storage) throw new Error('Storage not set');
    const current = LocalStorageService.storage.get<T>(key);
    const wasDefined = current !== undefined;
    if (!wasDefined) LocalStorageService.storage.update(key, value);
    return wasDefined ? current : value;
  }

  public static deleteValue(key: string) {
    if (!LocalStorageService.storage) throw new Error('Storage not set');
    return LocalStorageService.storage.update(key, undefined);
  }
}
