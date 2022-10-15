import {Injectable} from "@angular/core";
import {ITokenResponse} from "../../models/api/auth.models";
import {StorageService} from "./storage.service";

export type AuthStatus = 'ok' | 'accessExpired' | 'refreshExpired' | 'allExpired' | 'none';

type Key = keyof ITokenResponse;
type Keys = Key[];

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService extends StorageService {

  private _keys: Keys = ['access_token', 'access_expires_at', 'refresh_token', 'refresh_expires_at'];

  public setAuth(data: ITokenResponse) {
    for (const key in data) {
      this.setItem(key, data[key as Key])
    }
  }

  public removeAuth() {
    for (const i in this._keys) {
      this.removeItem(this._keys[i]);
    }
  }

  private _isAuthExists(): boolean {
    for (const i in  this._keys) {
      if (!this.getItem(this._keys[i])) return false;
    }
    return true;
  }

  private _isAccessExpired(): boolean {
    const expiredAt = this.getItem('access_expires_at');
    if (typeof expiredAt === 'string') {
      return new Date() > new Date(expiredAt);
    }
    return true;
  }

  private _isRefreshExpired(): boolean {
    const expiredAt = this.getItem('refresh_expires_at');
    if (typeof expiredAt === 'string') {
      return new Date() > new Date(expiredAt);
    }
    return true;
  }

  public getStatus(): AuthStatus {
    if (!this._isAuthExists()) {
      return 'none';
    } else if (this._isAccessExpired() && !this._isRefreshExpired()) {
      return 'accessExpired';
    } else if (this._isAccessExpired() && this._isRefreshExpired()) {
      return 'allExpired';
    } else {
      return 'ok';
    }
  }

  public getAccessToken(): string | null {
    return this.getItem('access_token');
  }

  public getRefreshToken(): string | null {
    return this.getItem('refresh_token');
  }

}
