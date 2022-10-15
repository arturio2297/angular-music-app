import {ApiService, HandleError} from "./api.service";
import {catchError, Observable} from "rxjs";
import {IGenreItem} from "../../models/api/genres.models";
import HttpUtils from "../../utils/http.utils";

export class GenresApiService {

  private _url: string;
  private _throwErrorName = 'Genres service error';

  constructor(
    private _api: ApiService,
    private _handleError: HandleError
  ) {
    this._url = _api.baseUrl + '/api/v1/genres';
  }

  public list(name: UniqueName): Observable<IGenreItem[]> {
    return this._api.client.get<IGenreItem[]>(this._url, {
        headers: this._api.headers,
        params: HttpUtils.createParams({ name })
      })
      .pipe(
        catchError(x => this._handleError(x, this._throwErrorName))
      );
  }

}
