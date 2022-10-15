import {ApiService, HandleError} from "./api.service";
import {IPageResponse} from "../../models/api/coomon.models";
import {catchError, Observable} from "rxjs";
import {
  IAddGroupRequest, IGroupResponse,
  IGroupItem,
  IGroupsFilterParameters,
  IUpdateGroupRequest
} from "../../models/api/groups.models";
import HttpUtils from "../../utils/http.utils";
import {ITrackItem, ITracksGroupFilterParameters} from "../../models/api/track.models";

export class GroupsApiService {

  private _url: string;
  private _throwErrorName = 'Groups service error';

  constructor(
    private _api: ApiService,
    private _handleError: HandleError
  ) {
    this._url = _api.baseUrl + '/api/v1/groups';
  }

  public list(parameters: IGroupsFilterParameters): Observable<IPageResponse<IGroupItem>> {
    return this._api.client.get<IPageResponse<IGroupItem>>(this._url, {
      headers: this._api.headers,
      params: HttpUtils.createParams(parameters)
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public tracks(parameters: ITracksGroupFilterParameters): Observable<IPageResponse<ITrackItem>> {
    return this._api.client.get<IPageResponse<ITrackItem>>(`${this._url}/tracks`, {
      headers: this._api.headers,
      params: HttpUtils.createParams(parameters)
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public get(id: ID): Observable<IGroupResponse> {
    return this._api.client.get<IGroupResponse>(`${this._url}/${id}`, {
      headers: this._api.headers
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public add(request: IAddGroupRequest, image?: File): Observable<IGroupResponse> {
    const formData = HttpUtils.createFormData(
      {name: 'request', data: request},
      {name: 'image', data: image}
    );
    return this._api.client.post<IGroupResponse>(this._url, formData, {
      headers: this._api.headers
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

  public update(id: ID, request: IUpdateGroupRequest, image?: File): Observable<IGroupResponse> {
    const formData = HttpUtils.createFormData(
      {name: 'request', data: request},
      {name: 'image', data: image}
    );
    return this._api.client.post<IGroupResponse>(`${this._url}/${id}`, formData, {
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

  public checkExistsByName(name: UniqueName, id: ID = ''): Observable<boolean> {
    return this._api.client.get<boolean>(this._url + '/check/name', {
      headers: this._api.headers,
      params: HttpUtils.createParams({ name, id })
    })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

}
