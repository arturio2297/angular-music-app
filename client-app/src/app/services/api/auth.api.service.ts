import {ApiService, HandleError} from "./api.service";
import {catchError, Observable} from "rxjs";
import {GrantType, ITokenResponse} from "../../models/api/auth.models";

export class AuthApiService {

  private _url: string;
  private _throwErrorName = 'Auth service error';

  constructor(
    private _api: ApiService,
    private _handleError: HandleError,
  ) {
    this._url = _api.baseUrl + '/api/v1/token';
  }

  public login(username: string, password: string): Observable<ITokenResponse> {
    return this._api.client.post<ITokenResponse>(this._url,
      {username, password, grant_type: GrantType.Password}
    )
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public refresh(refreshToken: string): Observable<ITokenResponse> {
    return this._api.client.post<ITokenResponse>(this._url,
      {refresh_token: refreshToken, grant_type: GrantType.RefreshToken}
    )
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

}
