import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {AuthApiService} from "./auth.api.service";
import {AccountApiService} from "./account.api.service";
import {AuthStorageService} from "../storage/auth.storage.service";
import {Observable, throwError} from "rxjs";
import {RegistrationApiService} from "./registration.api.service";
import {GroupsApiService} from "./groups.api.service";
import {GenresApiService} from "./genres.api.service";
import {AlbumsApiService} from "./albums.api.service";
import {TrackApiService} from "./track.api.service";
import {IErrorState} from "../../models/store/ui.store.models";
import {PlayerApiService} from "./player.api.service";
import {TrackListsApiService} from "./track-lists.api.service";
import {MeApiService} from "./me.api.service";

export type HandleError = (errorResponse: HttpErrorResponse, throwErrorName: string) => Observable<never>;
export type ChangeErrorState = (error: IErrorState) => void;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = environment.apiUrlBase;

  auth: AuthApiService;
  account: AccountApiService;
  registration: RegistrationApiService;
  groups: GroupsApiService;
  albums: AlbumsApiService;
  genres: GenresApiService;
  tracks: TrackApiService;
  player: PlayerApiService;
  trackLists: TrackListsApiService;
  me: MeApiService;

  private _changeErrorState: ChangeErrorState;

  constructor(
    public client: HttpClient,
    private _authStorage: AuthStorageService
  ) {
  }

  public init(changeErrorState: ChangeErrorState) {
    this._changeErrorState = changeErrorState;
    this.auth = new AuthApiService(this, this._handleError.bind(this));
    this.account = new AccountApiService(this, this._handleError.bind(this));
    this.registration = new RegistrationApiService(this, this._handleError.bind(this));
    this.groups = new GroupsApiService(this, this._handleError.bind(this));
    this.albums = new AlbumsApiService(this, this._handleError.bind(this));
    this.genres = new GenresApiService(this, this._handleError.bind(this));
    this.tracks = new TrackApiService(this, this._handleError.bind(this));
    this.player = new PlayerApiService(this, this._handleError.bind(this));
    this.trackLists = new TrackListsApiService(this, this._handleError.bind(this));
    this.me = new MeApiService(this, this._handleError.bind(this));
  }

  private _handleError(response: HttpErrorResponse, throwErrorName: string) {
    let message = response.message;
    let code = response.status;
    if (response.error && response.error.message && response.error.code) {
      message = response.error.message;
      code = response.error.code;
    }
    this._changeErrorState({message, code});
    return throwError(() => new Error(throwErrorName))
  }

  public get headers(): HttpHeaders {
    const accessToken = this._authStorage.getAccessToken();
    return accessToken ? new HttpHeaders().set('Authorization', `Bearer ${accessToken}`) : new HttpHeaders();
  }

  public accountAvatarUrl(id: ID): string {
    return `${this.baseUrl}/api/v1/account/${id}/avatar`;
  }

  public groupImageUrl(id: ID): string {
    return `${this.baseUrl}/api/v1/groups/${id}/image`;
  }

  public albumImageUrl(id: ID): string {
    return `${this.baseUrl}/api/v1/albums/${id}/image`
  }

  public trackListImageUrl(id: ID): string {
    return `${this.baseUrl}/api/v1/track-lists/${id}/image`;
  }

  public trackAudioUrl(id: ID): string {
    return `${this.baseUrl}/api/v1/tracks/${id}/audio`;
  }

}
