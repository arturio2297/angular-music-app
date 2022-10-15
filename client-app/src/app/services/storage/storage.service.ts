import JsonUtils from "../../utils/json.utils";

export abstract class StorageService {

  protected setItem(key: StorageKey, value: any) {
    localStorage.setItem(key, JsonUtils.stringify(value));
  }

  protected removeItem(key: string) {
    localStorage.removeItem(key);
  }

  protected getItem<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    return value ? JsonUtils.parse(value) as T : null;
  }

}


