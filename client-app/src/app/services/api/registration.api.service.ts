import {ApiService, HandleError} from "./api.service";
import {IRegistrationRequest} from "../../models/api/registration.contracts";
import {catchError, Observable} from "rxjs";
import HttpUtils from "../../utils/http.utils";

export class RegistrationApiService {

  private _url: string;
  private _throwErrorName = 'Registration service error';

  constructor(
    private _api: ApiService,
    private _handleError: HandleError
  ) {
    this._url = _api.baseUrl + '/api/v1/registration';
  }

  public register(request: IRegistrationRequest): Observable<void> {
    return this._api.client.post<void>(this._url, request, {
      headers: this._api.headers
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public checkExistsByEmail(email: UniqueName): Observable<boolean> {
    return this._api.client.get<boolean>(this._url + '/check/email', {
        params: HttpUtils.createParams({ email }),
        headers: this._api.headers
      }
    )
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public checkExistsByUsername(username: UniqueName): Observable<boolean> {
    return this._api.client.get<boolean>(this._url + '/check/username', {
        params: HttpUtils.createParams({ username }),
        headers: this._api.headers
      }
    )
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

}
