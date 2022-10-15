import {Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {IAudioPlayerStoreState} from "../../models/store/player.store.models";

const key = 'player';
type StorageKeys = keyof IAudioPlayerStoreState;

@Injectable({
  providedIn: 'root'
})
export class PlayerStorageService extends StorageService {

  public set(value: IAudioPlayerStoreState) {
    this.setItem(key, value);
  }

  public get(): IAudioPlayerStoreState | null {
    return this.getItem<IAudioPlayerStoreState>(key);
  }

  public remove(...keys: StorageKeys[]) {
    keys.length ? this._removeItem(...keys) : this._remove();
  }

  private _removeItem(...keys: StorageKeys[]) {
    const state = this.get();
    if (!state) return;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      delete state[key];
    }

    this.set(state);
  }

  private _remove() {
    this.removeItem(key);
  }

}
