import {ApiService, HandleError} from "./api.service";
import {catchError, Observable} from "rxjs";
import {IPlayerResponse} from "../../models/api/player.models";
import HttpUtils from "../../utils/http.utils";

export class PlayerApiService {

  private _url: string;
  private _throwErrorName = 'Player service error';

  constructor(
    private _api: ApiService,
    private _handleError: HandleError
  ) {
    this._url = _api.baseUrl + '/api/v1/player'
  }

  public next(trackId: ID, listId: ID): Observable<IPlayerResponse> {
    return this._api.client.get<IPlayerResponse>(`${this._url}/${listId}`, {
      headers: this._api.headers,
      params: HttpUtils.createParams({ trackId, listId })
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public first(listId: ID): Observable<IPlayerResponse> {
    return this._api.client.get<IPlayerResponse>(`${this._url}/${listId}/first`, {
      headers: this._api.headers
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

}
