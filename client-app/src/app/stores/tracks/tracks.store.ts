import {
  ChangeState, ILikedItem, ISavedItem,
  IStore,
  IStorePaginationState,
  LikedItemsState,
  SavedItemsState
} from "../../models/store/store.models";
import {
  TracksStoreFilterState,
  ITracksStoreState,
  TracksStoreFilterField,
  TracksStoreFilterValue,
  TracksStoreDialogField,
  TracksStoreDialogValue,
  TracksStoreDialogState,
  TracksStoreLoadingState, TracksStoreLoadingField, TracksFor
} from "../../models/store/tracks.store.models";
import {BehaviorSubject, finalize, Observable} from "rxjs";
import {ApiService} from "../../services/api/api.service";
import {NavigationService} from "../../services/navigation.service";
import {
  IAddTrackRequest,
  ITrackItem,
  IUpdateTrackRequest
} from "../../models/api/track.models";
import {noOp} from "../../models/common/common.models";
import {paginationStoreInitialState, tracksStoreFilterInitialState} from "../root.store";
import {IPageResponse, OnLiked, OnPageFetched, OnSaved} from "../../models/api/coomon.models";
import {SearchStorageService} from "../../services/storage/search.storage.service";

export interface IFetchTracksParams {
  fetchMore?: boolean;
}

export type OnTracksFetched = OnPageFetched<ITrackItem>;

export type ChangeTracksState =  ChangeState<ITracksStoreState>;

export class TracksStore implements IStore<ITracksStoreState> {

  readonly state$ = new BehaviorSubject({} as ITracksStoreState);

  constructor(
    state$: Observable<ITracksStoreState>,
    private _changeState: ChangeTracksState,
    private _api: ApiService,
    private _navigationService: NavigationService,
    private _searchStorageService: SearchStorageService
  ) {
    state$.subscribe(x => this.state$.next(x));
  }

  public fetchTracks(params: IFetchTracksParams, onSuccess: OnTracksFetched = noOp, onFail = noOp) {
    this._setLoadingField(true, 'fetchTracks');
    const parameters= {
      page: params.fetchMore ? this.pagination.page + 1 : this.pagination.page,
      size: this.pagination.size,
      search: this.filter.search
    };

    let response: Observable<IPageResponse<ITrackItem>>;

    switch (this.tracksFor) {
      case "user":
        response = this._api.me.tracks(parameters)
        break;
      case "group":
        response = this._api.groups.tracks({
          ...parameters,
          groupId: this.filter.groupId
        });
        break;
      case "album":
        response = this._api.albums.tracks({
          ...parameters,
          albumId: this.filter.albumId
        });
        break;
      case "track-list":
        response = this._api.trackLists.tracks({
          ...parameters,
          trackListId: this.filter.trackListId
        });
        break;
      default:
        response = this._api.tracks.list({
          ...parameters,
          groupId: this.filter.groupId,
          albumId: this.filter.albumId,
          trackListId: this.filter.trackListId,
          notInAlbum: this.filter.notInAlbum,
          notInGroup: this.filter.notInGroup,
          notInTrackList: this.filter.notInTrackList
        });
    }

    response
      .pipe(
        finalize(() => this._setLoadingField(false, 'fetchTracks'))
      )
      .subscribe(
        x => {
          const tracks = params.fetchMore ? [...this.tracks, ...x.items] : x.items;
          this._setTracks(tracks);
          const {page, size, totalPages, totalElements} = x;
          this._setPagination({ page, size, totalPages, totalElements });

          if (this.filter.search && x.items.length) {
            this._searchStorageService.addSearchQuery(this.filter.search, 'tracks');
          }

          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public clearTracks() {
    this._setTracks([]);
  }

  public clearTracksAndFilters() {
    this._setTracks([]);
    this._setFilter(tracksStoreFilterInitialState);
  }

  public refreshTracks(onSuccess: OnTracksFetched = noOp, onFail = noOp) {
    this._setPagination(paginationStoreInitialState);
    this.fetchTracks({}, onSuccess, onFail);
  }

  public addTrack(request: IAddTrackRequest, audio: File, onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'addTrack');
    this._api.tracks.add(request, audio)
      .pipe(
        finalize(() => this._setLoadingField(false, 'addTrack'))
      )
      .subscribe(
        () => {
          this.refreshTracks();
          onSuccess();
        },
        () => {
          onFail();
        }
      );
  }

  public updateTrack(id: ID, request: IUpdateTrackRequest, audio?: File, onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'updateTrack');
    this._api.tracks.update(id, request, audio)
      .pipe(
        finalize(() => this._setLoadingField(false, 'updateTrack'))
      )
      .subscribe(
        () => {
          this.refreshTracks();
          onSuccess();
        },
        () => {
          onFail();
        }
      );
  }

  public deleteTrack(id: ID, onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'deleteTrack');
    this._api.tracks.delete(id)
      .pipe(
        finalize(() => this._setLoadingField(false, 'deleteTrack'))
      )
      .subscribe(
        () => {
          this.refreshTracks();
          onSuccess();
        },
        () => {
          onFail();
        }
      );
  }

  public checkName(name: UniqueName, albumId: ID, trackId?: ID): Observable<boolean> {
    this._setLoadingField(true, 'checkName');
    return this._api.tracks.checkExistsByName(name, albumId, trackId)
      .pipe(
        finalize(() => this._setLoadingField(false, 'checkName'))
      );
  }

  public likeTrack(id: ID, onSuccess: OnLiked = noOp, onFail = noOp) {
    this._setLoadingField(true, 'likeTrack');
    this._api.tracks.like(id)
      .pipe(
        finalize(() => this._setLoadingField(false, 'likeTrack'))
      )
      .subscribe(
        x => {
          this._setLikeTrack(id, x);
          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public saveTrack(id: ID, onSuccess: OnSaved = noOp, onFail = noOp) {
    this._setLoadingField(true, 'saveTrack');
    this._api.tracks.save(id)
      .pipe(
        finalize(() => this._setLoadingField(false, 'saveTrack'))
      )
      .subscribe(
        x => {
          this._setSavedTrack(id, { saved: x });
          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public fetchFile(id: ID): Observable<ArrayBuffer> {
    this._setLoadingField(true, 'fetchFile');
    return this._api.tracks.file(id)
      .pipe(
        finalize(() => this._setLoadingField(false, 'fetchFile'))
      );
  }

  public removeSearchQuery(searchQuery: string) {
    this._searchStorageService.removeQuery(searchQuery, 'tracks');
  }

  private _setLikeTrack(id: ID, likedTrack: ILikedItem) {
    const likedTracks = {...this.likedTracks};
    likedTracks[id] = likedTrack;
    this._changeState({...this.state$.value, likedTracks});
  }

  private _setSavedTrack(id: ID, savedTrack: ISavedItem) {
    const savedTracks = {...this.savedTracks};
    savedTracks[id] = savedTrack;
    this._changeState({...this.state$.value, savedTracks});
  }

  private _setLoadingField(value: boolean, key: TracksStoreLoadingField) {
    const loading = {...this.loading};
    loading[key] = value;
    this._changeState({...this.state$.value, loading});
  }

  public setTracksFor(tracksFor: TracksFor) {
    this._changeState({...this.state$.value, tracksFor})
  }

  public get tracksFor(): TracksFor {
    return this.state$.getValue().tracksFor;
  }

  public setPageParams(value: number, key: 'page' | 'size') {
    const pagination = {...this.pagination};
    pagination[key] = value;
    this._setPagination(pagination);
  }

  private _setPagination(pagination: IStorePaginationState) {
    this._changeState({...this.state$.value, pagination});
  }

  private _setFilter(filter: TracksStoreFilterState) {
    this._changeState({...this.state$.value, filter});
  }

  public setFilterField(value: TracksStoreFilterValue, key: TracksStoreFilterField) {
    const filter = {...this.filter};
    filter[key] = value;
    this._setFilter(filter);
  }

  public setDialogField(value: TracksStoreDialogValue, key: TracksStoreDialogField) {
    const dialog = {...this.dialog};
    dialog[key] = value;
    this._changeState({...this.state$.value, dialog});
  }

  private _setTracks(tracks: ITrackItem[]) {
    this._changeState({...this.state$.value, tracks});
  }

  public get tracks(): ITrackItem[] {
    return this.state$.getValue().tracks;
  }

  public get pagination(): IStorePaginationState {
    return this.state$.getValue().pagination;
  }

  public get isLastPage(): boolean {
    return this.pagination.page >= (this.pagination.totalPages - 1);
  }

  public get filter(): TracksStoreFilterState {
    return this.state$.getValue().filter;
  }

  public get searchQueries(): string[] {
    return this._searchStorageService.getSearchQueries('tracks');
  }

  public get dialog(): TracksStoreDialogState {
    return this.state$.getValue().dialog;
  }

  public get loading(): TracksStoreLoadingState {
    return this.state$.getValue().loading;
  }

  public get likedTracks(): LikedItemsState {
    return this.state$.getValue().likedTracks;
  }

  public get savedTracks(): SavedItemsState {
    return this.state$.getValue().savedTracks;
  }

}
