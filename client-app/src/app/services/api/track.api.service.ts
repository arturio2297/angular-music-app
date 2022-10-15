import {ApiService, HandleError} from "./api.service";
import {
  IAddTrackRequest,
  ITrackFilterParameters,
  ITrackItem,
  IUpdateTrackRequest
} from "../../models/api/track.models";
import {catchError, Observable} from "rxjs";
import HttpUtils from "../../utils/http.utils";
import {ILikeResponse, IPageResponse} from "../../models/api/coomon.models";

export class TrackApiService {

  private _url: string;
  private _throwErrorName = 'Track service error';

  constructor(
    private _api: ApiService,
    private _handleError: HandleError,
  ) {
    this._url = _api.baseUrl + '/api/v1/tracks';
  }

  public list(parameters: ITrackFilterParameters): Observable<IPageResponse<ITrackItem>> {
    return this._api.client.get<IPageResponse<ITrackItem>>(this._url, {
      headers: this._api.headers,
      params: HttpUtils.createParams(parameters)
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public add(request: IAddTrackRequest, audio: File): Observable<ITrackItem> {
    const formData = HttpUtils.createFormData(
      {name: 'request', data: request},
      {name: 'audio', data: audio}
    );
    return this._api.client.post<ITrackItem>(this._url, formData, {
      headers: this._api.headers
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public update(id: ID, request: IUpdateTrackRequest, audio?: File): Observable<ITrackItem> {
    const formData = HttpUtils.createFormData(
      {name: 'request', data: request},
      {name: 'audio', data: audio}
    );
    return this._api.client.post<ITrackItem>(`${this._url}/${id}`, formData, {
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

  public checkExistsByName(name: string, albumId: ID, trackId: ID = ''): Observable<boolean> {
    return this._api.client.get<boolean>(`${this._url}/check/name`, {
      headers: this._api.headers,
      params: HttpUtils.createParams({name, albumId, trackId})
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

  public file(id: ID): Observable<ArrayBuffer> {
    return this._api.client.get(`${this._url}/${id}/audio`, {
      responseType: 'arraybuffer',
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

}
