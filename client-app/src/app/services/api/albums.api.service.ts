import {ApiService, HandleError} from "./api.service";
import {
  IAddAlbumRequest,
  IAlbumResponse,
  IAlbumItem,
  IAlbumsFilterParameters
} from "../../models/api/albums.models";
import {catchError, Observable} from "rxjs";
import HttpUtils from "../../utils/http.utils";
import {IPageResponse, ILikeResponse} from "../../models/api/coomon.models";
import {ITrackItem, ITracksAlbumFilterParameters} from "../../models/api/track.models";

export class AlbumsApiService {

  private _url: string;
  private _throwErrorName = 'Albums service error';

  constructor(
    private _api: ApiService,
    private _handleError: HandleError
  ) {
    this._url = _api.baseUrl + '/api/v1/albums';
  }

  public list(parameters: IAlbumsFilterParameters): Observable<IPageResponse<IAlbumItem>> {
    return this._api.client.get<IPageResponse<IAlbumItem>>(this._url, {
      headers: this._api.headers,
      params: HttpUtils.createParams(parameters)
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public tracks(parameters: ITracksAlbumFilterParameters): Observable<IPageResponse<ITrackItem>> {
    return this._api.client.get<IPageResponse<ITrackItem>>(`${this._url}/tracks`, {
      headers: this._api.headers,
      params: HttpUtils.createParams(parameters)
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public get(id: ID): Observable<IAlbumResponse> {
    return this._api.client.get<IAlbumResponse>(`${this._url}/${id}`, {
      headers: this._api.headers
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public add(request: IAddAlbumRequest, image?: File): Observable<IAlbumItem> {
    const formData = HttpUtils.createFormData(
      {name: 'request', data: request},
      {name: 'image', data: image}
    );
    return this._api.client.post<IAlbumItem>(this._url, formData, {
      headers: this._api.headers
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public update(id: ID, request: IAddAlbumRequest, image?: File): Observable<IAlbumResponse> {
    const formData = HttpUtils.createFormData(
      {name: 'request', data: request},
      {name: 'image', data: image}
    );
    return this._api.client.post<IAlbumResponse>(`${this._url}/${id}`, formData, {
      headers: this._api.headers
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public delete(id: ID): Observable<void> {
    return this._api.client.delete<void>(`${this._url}/${id}`, {
      headers: this._api.headers
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public checkExistsByName(name: UniqueName, groupId: ID, albumId: ID = ''): Observable<boolean> {
    return this._api.client.get<boolean>(`${this._url}/check/name`, {
      headers: this._api.headers,
      params: HttpUtils.createParams({name, groupId, albumId})
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public like(id: ID): Observable<ILikeResponse> {
    return this._api.client.put<ILikeResponse>(`${this._url}/like/${id}`, {}, {
      headers: this._api.headers
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public save(id: ID): Observable<boolean> {
    return this._api.client.put<boolean>(`${this._url}/save/${id}`, {}, {
      headers: this._api.headers
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

}
