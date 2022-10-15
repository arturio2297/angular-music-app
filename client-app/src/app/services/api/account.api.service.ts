import {ApiService, HandleError} from "./api.service";
import {catchError, Observable} from "rxjs";
import {IAccountResponse, IUpdateAccountRequest} from "../../models/api/account.models";
import HttpUtils from "../../utils/http.utils";

export class AccountApiService {

  private _url: string;
  private _throwErrorName = 'Account service error';

  constructor(
    private _api: ApiService,
    private _handleError: HandleError,
  ) {
    this._url = _api.baseUrl + '/api/v1/account';
  }

  public get(): Observable<IAccountResponse> {
    return this._api.client.get<IAccountResponse>(this._url, {
      headers: this._api.headers
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public update(request: IUpdateAccountRequest, avatar?: File): Observable<IAccountResponse> {
    const formData = HttpUtils.createFormData(
      {name: 'request', data: request},
      {name: 'avatar', data: avatar}
    );
    return this._api.client.post<IAccountResponse>(this._url, formData, {
      headers: this._api.headers
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public checkExistsByUsername(username: UniqueName): Observable<boolean> {
    return this._api.client.get<boolean>(this._url + '/check/username', {
        params: HttpUtils.createParams({username}),
        headers: this._api.headers
      }
    )
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public checkExistsByEmail(email: UniqueName): Observable<boolean> {
    return this._api.client.get<boolean>(
      this._url + '/check/email',
      {
        params: HttpUtils.createParams({email}),
        headers: this._api.headers
      }
    )
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

}
