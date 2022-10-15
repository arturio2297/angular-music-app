import {ChangeState, IStore, IStorePaginationState} from "../../models/store/store.models";
import {
  IMeStoreAlbumsState,
  IMeStoreState,
  IMeStoreTrackListsState,
  IMeStoreTracksState,
  MeStoreAlbumsFilterField,
  MeStoreAlbumsFilterState,
  MeStoreLoadingField,
  MeStoreLoadingState, MeStoreTrackListsFilterField,
  MeStoreTrackListsFilterState, MeStoreTracksFilterField,
  MeStoreTracksFilterState
} from "../../models/store/me.store.models";
import {BehaviorSubject, finalize, Observable} from "rxjs";
import {ApiService} from "../../services/api/api.service";
import {NavigationService} from "../../services/navigation.service";
import {noOp} from "../../models/common/common.models";
import {ITrackItem, IUserTracksFilterParameters} from "../../models/api/track.models";
import {ITrackListItem, IUserTrackListsFilterParameters} from "../../models/api/track-lists.models";
import {IAlbumItem, IUserAlbumsFilterParameters} from "../../models/api/albums.models";
import {
  meStoreAlbumsFilterInitialState,
  meStoreTrackListsFilterInitialState, meStoreTracksFilterInitialState,
  paginationStoreInitialState
} from "../root.store";
import {SearchStorageService} from "../../services/storage/search.storage.service";
import {OnAlbumsFetched} from "../albums/albums.store";
import {OnTrackListsFetched} from "../track-lists/track-lists.store";
import {OnTracksFetched} from "../tracks/tracks.store";

export type ChangeMeState = ChangeState<IMeStoreState>;

export class MeStore implements IStore<IMeStoreState> {

  readonly state$ = new BehaviorSubject({} as IMeStoreState);

  constructor(
    state$: Observable<IMeStoreState>,
    private _changeState: ChangeMeState,
    private _api: ApiService,
    private _navigationService: NavigationService,
    private _searchStorageService: SearchStorageService
  ) {
    state$.subscribe(x => this.state$.next(x))
  }

  public init(onSuccess = noOp, onFail = noOp) {
  }

  public fetchAlbums(fetchMore = false, onSuccess: OnAlbumsFetched = noOp, onFail = noOp) {
    this._setLoadingField(true, 'fetchAlbums');
    const parameters: IUserAlbumsFilterParameters = {
      page: fetchMore ? this.pagination.albums.page + 1 : this.pagination.albums.page,
      size: this.pagination.albums.size,
      groupId: this.filter.albums.groupId,
      search: this.filter.albums.search
    };
    this._api.me.albums(parameters)
      .pipe(
        finalize(() => this._setLoadingField(false, 'fetchAlbums'))
      )
      .subscribe(
        x => {
          const items = fetchMore ? [...this.albums, ...x.items] : x.items;
          this._setAlbumsItems(items);
          const {page, size, totalPages, totalElements} = x;
          this._setAlbumsPagination({page, size, totalPages, totalElements});

          if (this.filter.albums.search && x.items.length) {
            this._searchStorageService.addSearchQuery(this.filter.albums.search, 'albums');
          }

          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public clearAlbumsAndFilters() {
    this._setAlbumsItems([]);
    this._setAlbumsFilter(meStoreAlbumsFilterInitialState);
  }

  public refreshAlbums(onSuccess: OnAlbumsFetched = noOp, onFail = noOp) {
    this._setAlbumsPagination(paginationStoreInitialState);
    this.fetchAlbums(false, onSuccess, onFail);
  }

  public fetchTrackLists(fetchMore = false, onSuccess: OnTrackListsFetched = noOp, onFail = noOp) {
    this._setLoadingField(false, 'fetchTrackLists');
    const parameters: IUserTrackListsFilterParameters = {
      page: fetchMore ? this.pagination.trackLists.page + 1 : this.pagination.trackLists.page,
      size: this.pagination.trackLists.size,
      search: this.filter.trackLists.search,
      authorId: this.filter.trackLists.authorId
    };
    this._api.me.trackLists(parameters)
      .pipe(
        finalize(() => this._setLoadingField(false, 'fetchTrackLists'))
      )
      .subscribe(
        x => {
          const items = fetchMore ? [...this.trackLists, ...x.items] : x.items;
          this._setTrackListsItems(items);
          const {page, size, totalPages, totalElements} = x;
          this._setTrackListsPagination({page, size, totalPages, totalElements});

          if (this.filter.trackLists.search && x.items.length) {
            this._searchStorageService.addSearchQuery(this.filter.trackLists.search, 'trackLists');
          }

          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public clearTrackListsAndFilters() {
    this._setTracksItems([]);
    this._setTrackListsFilter(meStoreTrackListsFilterInitialState);
  }

  public refreshTrackLists(onSuccess: OnTrackListsFetched = noOp, onFail = noOp) {
    this._setTrackListsPagination(paginationStoreInitialState);
    this.fetchTrackLists(false, onSuccess, onFail);
  }

  public fetchTracks(fetchMore = false, onSuccess: OnTracksFetched = noOp, onFail = noOp) {
    this._setLoadingField(false, 'fetchTracks');
    const parameters: IUserTracksFilterParameters = {
      page: fetchMore ? this.pagination.tracks.page + 1 : this.pagination.tracks.page,
      size: this.pagination.tracks.size,
      search: this.filter.tracks.search
    };
    this._api.me.tracks(parameters)
      .pipe(
        finalize(() => this._setLoadingField(false, 'fetchTracks'))
      )
      .subscribe(
        x => {
          const items = fetchMore ? [...this.tracks, ...x.items] : x.items;
          this._setTracksItems(items);
          const {page, size, totalPages, totalElements} = x;
          this._setTracksPagination({ page, size, totalPages, totalElements });

          if (this.filter.tracks.search && x.items.length) {
            this._searchStorageService.addSearchQuery(this.filter.tracks.search, 'tracks');
          }

          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public clearTracksAndFilters() {
    this._setTracksItems([]);
    this._setTracksFilter(meStoreTracksFilterInitialState);
  }

  public refreshTracks(onSuccess: OnTracksFetched = noOp, onFail = noOp) {
    this._setTracksPagination(paginationStoreInitialState);
    this.fetchTracks(false, onSuccess, onFail);
  }

  private _setAlbumsItems(items: IAlbumItem[]) {
    this._changeAlbumsState({...this._albumsState, items});
  }

  private _setTrackListsItems(items: ITrackListItem[]) {
    this._changeTrackListsState({...this._trackListsState, items});
  }

  private _setTracksItems(items: ITrackItem[]) {
    this._changeTracksState({...this._tracksState, items});
  }

  public setAlbumsFilterField(value: string, key: MeStoreAlbumsFilterField) {
    const filter = {...this.filter.albums};
    filter[key] = value;
    this._setAlbumsFilter(filter);
  }

  public setTrackListsFilterField(value: string, key: MeStoreTrackListsFilterField) {
    const filter = {...this.filter.trackLists};
    filter[key] = value;
    this._setTrackListsFilter(filter);
  }

  public setTracksFilterField(value: string, key: MeStoreTracksFilterField) {
    const filter = {...this.filter.tracks};
    filter[key] = value;
    this._setTracksFilter(filter);
  }

  public setAlbumsPageParams(value: number, key: 'page' | 'size') {
    const pagination = {...this.pagination.albums};
    pagination[key] = value;
    this._setAlbumsPagination(pagination);
  }

  public setTrackListsPageParams(value: number, key: 'page' | 'size') {
    const pagination = {...this.pagination.trackLists};
    pagination[key] = value;
    this._setTrackListsPagination(pagination);
  }

  public setTracksPageParams(value: number, key: 'page' | 'size') {
    const pagination = {...this.pagination.tracks};
    pagination[key] = value;
    this._setTracksPagination(pagination);
  }

  private _setAlbumsFilter(filter: MeStoreAlbumsFilterState) {
    this._changeAlbumsState({...this._albumsState, filter});
  }

  private _setTrackListsFilter(filter: MeStoreTrackListsFilterState) {
    this._changeTrackListsState({...this._trackListsState, filter});
  }

  private _setTracksFilter(filter: MeStoreTracksFilterState) {
    this._changeTracksState({...this._tracksState, filter});
  }

  private _setAlbumsPagination(pagination: IStorePaginationState) {
    this._changeAlbumsState({...this._albumsState, pagination});
  }

  private _setTrackListsPagination(pagination: IStorePaginationState) {
    this._changeTrackListsState({...this._trackListsState, pagination});
  }

  private _setTracksPagination(pagination: IStorePaginationState) {
    this._changeTracksState({...this._tracksState, pagination});
  }

  private _setLoadingField(value: boolean, key: MeStoreLoadingField) {
    const loading = {...this.loading};
    loading[key] = value;
    this._changeState({...this.state$.value, loading});
  }

  private _changeAlbumsState(albums: IMeStoreAlbumsState) {
    this._changeState({...this.state$.value, albums});
  }

  private _changeTrackListsState(trackLists: IMeStoreTrackListsState) {
    this._changeState({...this.state$.value, trackLists});
  }

  private _changeTracksState(tracks: IMeStoreTracksState) {
    this._changeState({...this.state$.value, tracks});
  }

  private get _albumsState(): IMeStoreAlbumsState {
    return this.state$.getValue().albums;
  }

  private get _trackListsState(): IMeStoreTrackListsState {
    return this.state$.getValue().trackLists;
  }

  private get _tracksState(): IMeStoreTracksState {
    return this.state$.getValue().tracks;
  }

  public get pagination() {
    return {
      albums: this.state$.getValue().albums.pagination,
      trackLists: this.state$.getValue().trackLists.pagination,
      tracks: this.state$.getValue().tracks.pagination
    };
  }

  public get isLastPage() {
    const {albums, trackLists, tracks} = this.pagination;
    return {
      albums: albums.page >= (albums.totalPages - 1),
      trackLists: trackLists.page >= (trackLists.totalPages - 1),
      tracks: tracks.page >= (tracks.totalPages - 1)
    };
  }

  public get filter() {
    return {
      albums: this.state$.getValue().albums.filter,
      trackLists: this.state$.getValue().trackLists.filter,
      tracks: this.state$.getValue().tracks.filter
    };
  }

  public get searchQueries() {
    return this._searchStorageService.getAllSearchQueries();
  }

  public get loading(): MeStoreLoadingState {
    return this.state$.getValue().loading;
  }

  public get albums(): IAlbumItem[] {
    return this.state$.getValue().albums.items;
  }

  public get trackLists(): ITrackListItem[] {
    return this.state$.getValue().trackLists.items;
  }

  public get tracks(): ITrackItem[] {
    return this.state$.getValue().tracks.items;
  }

}
