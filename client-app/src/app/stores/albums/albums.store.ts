import {
  IStore,
  IStorePaginationState, ChangeState, ILikedItem, LikedItemsState, SavedItemsState, ISavedItem
} from "../../models/store/store.models";
import {BehaviorSubject, finalize, Observable} from "rxjs";
import {ApiService} from "../../services/api/api.service";
import {NavigationService} from "../../services/navigation.service";
import {noOp} from "../../models/common/common.models";
import {
  IAddAlbumRequest,
  IAlbumResponse,
  IAlbumItem,
  IUpdateAlbumRequest, IAlbumsFilterParameters,
} from "../../models/api/albums.models";
import {albumsStoreFilterInitialState, paginationStoreInitialState} from "../root.store";
import {
  AlbumsStoreDialogField,
  AlbumsStoreDialogState, AlbumsStoreDialogValue, AlbumsStoreFilterField,
  AlbumsStoreFilterState,
  AlbumsStoreFilterValue,
  AlbumsStoreLoadingField,
  AlbumsStoreLoadingState,
  IAlbumsStoreState,
  IAlbumStoreSearchState
} from "../../models/store/albums.store.models";
import {OnFetched, OnLiked, OnPageFetched, OnSaved} from "../../models/api/coomon.models";
import {SearchStorageService} from "../../services/storage/search.storage.service";

export interface IFetchAlbumsParams {
  fetchMore?: boolean;
}

export type OnAlbumsFetched = OnPageFetched<IAlbumItem>;

export type OnAlbumFetched = OnFetched<IAlbumResponse>;

export type ChangeAlbumsState = ChangeState<IAlbumsStoreState>;

export class AlbumsStore implements IStore<IAlbumsStoreState> {

  readonly state$ = new BehaviorSubject({} as IAlbumsStoreState);

  constructor(
    state$: Observable<IAlbumsStoreState>,
    private _changeState: ChangeAlbumsState,
    private _api: ApiService,
    private _navigationService: NavigationService,
    private _searchStorageService: SearchStorageService
  ) {
    state$.subscribe(x => this.state$.next(x));
  }

  public init(onSuccess = noOp, onFail = noOp) {
  }

  public fetchAlbums(params: IFetchAlbumsParams, onSuccess: OnAlbumsFetched = noOp, onFail = noOp) {
    this._setLoadingField(true, 'fetchAlbums');
    const parameters: IAlbumsFilterParameters = {
      page: params.fetchMore ? this.pagination.page + 1 : this.pagination.page,
      size: this.pagination.size,
      search: this.filter.search as string,
      groupId: this.filter.groupId as string,
      tracksCount: this.filter.tracksCount as number
    };

    const response = this.albumsForUser ? this._api.me.albums(parameters) : this._api.albums.list(parameters);

    response
      .pipe(
        finalize(() => this._setLoadingField(false, 'fetchAlbums'))
      )
      .subscribe(
        x => {
          const albums = params.fetchMore ? [...this.albums, ...x.items] : x.items;
          this._setAlbums(albums);
          this._setPagination({page: x.page, size: x.size, totalElements: x.totalElements, totalPages: x.totalPages});
          if (this.filter.search && x.items.length) {
            this._searchStorageService.addSearchQuery(this.filter.search as string, 'albums');
          }
          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public clearAlbums() {
    this._setAlbums([]);
  }

  public refreshAlbums(onSuccess = noOp, onFail = noOp) {
    this._setPagination(paginationStoreInitialState);
    this.fetchAlbums({}, onSuccess, onFail);
  }

  public clearAlbumsAndFilters() {
    this._setAlbums([]);
    this._setFilter(albumsStoreFilterInitialState);
  }

  public fetchAlbum(id: ID, onSuccess: OnAlbumFetched = noOp, onFail = noOp) {
    this._setLoadingField(true, 'fetchAlbum');
    this._api.albums.get(id)
      .pipe(
        finalize(() => this._setLoadingField(false, 'fetchAlbum'))
      )
      .subscribe(
        x => {
          this._setAlbum(x);
          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public clearAlbum() {
    this._setAlbum(null);
  }

  public addAlbum(request: IAddAlbumRequest, image?: File, onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'addAlbum');
    this._api.albums.add(request, image)
      .pipe(
        finalize(() => this._setLoadingField(false, 'addAlbum'))
      )
      .subscribe(
        () => {
          this.refreshAlbums();
          this._navigationService.toAlbums();
          onSuccess();
        },
        () => {
          onFail();
        }
      );
  }

  public updateAlbum(id: ID, request: IUpdateAlbumRequest, image?: File, onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'updateAlbum');
    this._api.albums.update(id, request, image)
      .pipe(
        finalize(() => this._setLoadingField(false, 'updateAlbum'))
      )
      .subscribe(
        () => {
          this.refreshAlbums();
          this._navigationService.toAlbums();
          onSuccess();
        },
        () => {
          onFail();
        }
      );
  }

  public deleteAlbum(id: ID, onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'deleteAlbum');
    this._api.albums.delete(id)
      .pipe(
        finalize(() => this._setLoadingField(false, 'deleteAlbum'))
      )
      .subscribe(
        () => {
          this.refreshAlbums();
          onSuccess();
        },
        () => {
          onFail();
        }
      );
  }

  public searchGroups(name: UniqueName, onFound = noOp, onNotFound = noOp, onFail = noOp) {
    this._setLoadingField(true, 'searchGroups');
    this._api.groups.list({
      size: 1000,
      page: 0,
      search: name
    })
      .pipe(
        finalize(() => this._setLoadingField(false, 'searchGroups'))
      )
      .subscribe(
        x => {
          this._setSearch({...this.search, groups: x.items});
          x.items.length ? onFound() : onNotFound();
        },
        () => {
          onFail();
        }
      );
  }

  public clearSearchResult(key: keyof IAlbumStoreSearchState) {
    const search = {...this.search};
    search[key] = [];
    this._setSearch(search);
  }

  public checkName(name: UniqueName, groupId: ID, albumId?: ID): Observable<boolean> {
    this._setLoadingField(true, 'checkName');
    return this._api.albums.checkExistsByName(name, groupId, albumId)
      .pipe(
        finalize(() => this._setLoadingField(false, 'checkName'))
      );
  }

  public likeAlbum(id: ID, onSuccess: OnLiked = noOp, onFail = noOp) {
    this._setLoadingField(true, 'likeAlbum');
    this._api.albums.like(id)
      .pipe(
        finalize(() => this._setLoadingField(false, 'likeAlbum'))
      )
      .subscribe(
        x => {
          this._setLikedAlbum(id, x);
          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public saveAlbum(id: ID, onSuccess: OnSaved = noOp, onFail = noOp) {
    this._setLoadingField(true, 'saveAlbum');
    this._api.albums.save(id)
      .pipe(
        finalize(() => this._setLoadingField(false, 'saveAlbum'))
      )
      .subscribe(
        x => {
          this._setSavedAlbum(id, { saved: x });
          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public removeSearchQuery(searchQuery: string) {
    this._searchStorageService.removeQuery(searchQuery, 'albums');
  }

  public setPageParams(value: number, key: 'page' | 'size') {
    const pagination = {...this.pagination};
    pagination[key] = value;
    this._setPagination(pagination);
  }

  private _setLikedAlbum(id: ID, likedAlbum: ILikedItem) {
    const likedAlbums = {...this.likedAlbums};
    likedAlbums[id] = likedAlbum;
    this._changeState({...this.state$.value, likedAlbums});
  }

  private _setSavedAlbum(id: ID, savedAlbum: ISavedItem) {
    const savedAlbums = {...this.savedAlbums};
    savedAlbums[id] = savedAlbum;
    this._changeState({...this.state$.value, savedAlbums});
  }

  private _setPagination(pagination: IStorePaginationState) {
    this._changeState({...this.state$.value, pagination});
  }

  private _setFilter(filter: AlbumsStoreFilterState) {
    this._changeState({...this.state$.value, filter});
  }

  public setFilterField(value: AlbumsStoreFilterValue, key: AlbumsStoreFilterField) {
    const filter = {...this.filter};
    filter[key] = value;
    this._setFilter(filter);
  }

  public setDialogField(value: AlbumsStoreDialogValue, key: AlbumsStoreDialogField) {
    const dialog = {...this.dialog};
    dialog[key] = value;
    this._changeState({...this.state$.value, dialog});
  }

  private _setAlbums(albums: IAlbumItem[]) {
    this._changeState({...this.state$.value, albums});
  }

  private _setAlbum(album: IAlbumResponse | null) {
    this._changeState({...this.state$.value, album});
  }

  private _setLoadingField(value: boolean, key: AlbumsStoreLoadingField) {
    const loading = {...this.state$.value.loading};
    loading[key] = value;
    this._changeState({...this.state$.value, loading});
  }

  private _setSearch(search: IAlbumStoreSearchState) {
    this._changeState({...this.state$.value, search});
  }

  public setAlbumsForUser(albumsForUser: boolean) {
    this._changeState({...this.state$.value, albumsForUser});
  }

  public get albumsForUser(): boolean {
    return this.state$.getValue().albumsForUser;
  }

  public get pagination(): IStorePaginationState {
    return this.state$.getValue().pagination;
  }

  public get isLastPage(): boolean {
    return this.pagination.page >= (this.pagination.totalPages - 1);
  }

  public get filter(): AlbumsStoreFilterState {
    return this.state$.getValue().filter;
  }

  public get loading(): AlbumsStoreLoadingState {
    return this.state$.getValue().loading;
  }

  public get dialog(): AlbumsStoreDialogState {
    return this.state$.getValue().dialog;
  }

  public get albums(): IAlbumItem[] {
    return this.state$.getValue().albums;
  }

  public get album(): IAlbumResponse | null {
    return this.state$.getValue().album;
  }

  public get searchQueries(): string[] {
    return this._searchStorageService.getSearchQueries('albums');
  }

  public get search(): IAlbumStoreSearchState {
    return this.state$.getValue().search;
  }

  public get likedAlbums(): LikedItemsState {
    return this.state$.getValue().likedAlbums;
  }

  public get savedAlbums(): SavedItemsState {
    return this.state$.getValue().savedAlbums;
  }

}
