import {ApiService, HandleError} from "./api.service";
import {IAlbumItem, IUserAlbumsFilterParameters} from "../../models/api/albums.models";
import {catchError, Observable} from "rxjs";
import {IPageResponse} from "../../models/api/coomon.models";
import {ITrackListItem, IUserTrackListsFilterParameters} from "../../models/api/track-lists.models";
import {ITrackItem, IUserTracksFilterParameters} from "../../models/api/track.models";
import HttpUtils from "../../utils/http.utils";

export class MeApiService {

  private _url: string;
  private _throwErrorName = 'Me service error';

  constructor(
    private _api: ApiService,
    private _handleError: HandleError
  ) {
    this._url = _api.baseUrl + '/api/v1/me';
  }

  public albums(parameters: IUserAlbumsFilterParameters): Observable<IPageResponse<IAlbumItem>> {
    return this._api.client.get<IPageResponse<IAlbumItem>>(`${this._url}/albums`, {
      headers: this._api.headers,
      params: HttpUtils.createParams(parameters)
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public trackLists(parameters: IUserTrackListsFilterParameters): Observable<IPageResponse<ITrackListItem>> {
    return this._api.client.get<IPageResponse<ITrackListItem>>(`${this._url}/track-lists`, {
      headers: this._api.headers,
      params: HttpUtils.createParams(parameters)
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public tracks(parameters: IUserTracksFilterParameters): Observable<IPageResponse<ITrackItem>> {
    return this._api.client.get<IPageResponse<ITrackItem>>(`${this._url}/tracks`, {
      headers: this._api.headers,
      params: HttpUtils.createParams(parameters)
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

}
