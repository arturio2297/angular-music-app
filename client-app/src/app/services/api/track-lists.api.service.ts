import {ApiService, HandleError} from "./api.service";
import {
  IAddTrackListRequest,
  ITrackListItem,
  ITrackListResponse,
  ITrackListsFilterParameters, IUpdateTrackListRequest
} from "../../models/api/track-lists.models";
import {catchError, Observable} from "rxjs";
import {ILikeResponse, IPageResponse} from "../../models/api/coomon.models";
import HttpUtils from "../../utils/http.utils";
import {ITrackItem, ITracksTrackListFilterParameters} from "../../models/api/track.models";

export class TrackListsApiService {

  private _url: string;
  private _throwErrorName = 'Track lists service error';

  constructor(
    private _api: ApiService,
    private _handleError: HandleError
  ) {
    this._url = _api.baseUrl + '/api/v1/track-lists'
  }

  public list(parameters: ITrackListsFilterParameters): Observable<IPageResponse<ITrackListItem>> {
    return this._api.client.get<IPageResponse<ITrackListItem>>(this._url, {
      headers: this._api.headers,
      params: HttpUtils.createParams(parameters)
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public tracks(parameters: ITracksTrackListFilterParameters): Observable<IPageResponse<ITrackItem>> {
    return this._api.client.get<IPageResponse<ITrackItem>>(`${this._url}/tracks`, {
      headers: this._api.headers,
      params: HttpUtils.createParams(parameters)
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public get(id: ID): Observable<ITrackListResponse> {
    return this._api.client.get<ITrackListResponse>(`${this._url}/${id}`, {
      headers: this._api.headers
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public add(request: IAddTrackListRequest, image?: File): Observable<ITrackListResponse> {
    const formData = HttpUtils.createFormData(
      {name: 'request', data: request},
      {name: 'image', data: image}
    );
    return this._api.client.post<ITrackListResponse>(this._url, formData, {
      headers: this._api.headers
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public update(id: ID, request: IUpdateTrackListRequest, image?: File): Observable<ITrackListResponse> {
    const formData = HttpUtils.createFormData(
      {name: 'request', data: request},
      {name: 'image', data: image}
    );
    return this._api.client.post<ITrackListResponse>(`${this._url}/${id}`, formData, {
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

  public checkExistsByName(name: UniqueName, trackListId: ID = ''): Observable<boolean> {
    return this._api.client.get<boolean>(`${this._url}/check/name`, {
      headers: this._api.headers,
      params: HttpUtils.createParams({name, trackListId})
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
