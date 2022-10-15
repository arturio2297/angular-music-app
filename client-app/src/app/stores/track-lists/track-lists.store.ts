import {
  ChangeState, ILikedItem, ISavedItem,
  IStore,
  IStorePaginationState,
  LikedItemsState,
  SavedItemsState
} from "../../models/store/store.models";
import {
  ITrackListsStoreState,
  TrackListsStoreDialogField,
  TrackListsStoreDialogState,
  TrackListsStoreDialogValue, TrackListsStoreFilterField,
  TrackListsStoreFilterState, TrackListsStoreFilterValue,
  TrackListsStoreLoadingField,
  TrackListsStoreLoadingState
} from "../../models/store/track-lists.store.models";
import {BehaviorSubject, finalize, Observable} from "rxjs";
import {ApiService} from "../../services/api/api.service";
import {NavigationService} from "../../services/navigation.service";
import {
  IAddTrackListRequest,
  ITrackListItem,
  ITrackListResponse, ITrackListsFilterParameters,
  IUpdateTrackListRequest, TrackListSortField
} from "../../models/api/track-lists.models";
import {noOp} from "../../models/common/common.models";
import {paginationStoreInitialState, trackListsStoreFilterInitialState} from "../root.store";
import {OnFetched, OnLiked, OnPageFetched, OnSaved, SortOrder} from "../../models/api/coomon.models";
import {SearchStorageService} from "../../services/storage/search.storage.service";

export type FetchTrackListsParams = { fetchMore?: boolean; }

export type OnTrackListsFetched = OnPageFetched<ITrackListItem>;

export type OnTrackListFetched = OnFetched<ITrackListResponse>;

export type ChangeTackListsState = ChangeState<ITrackListsStoreState>;

export class TrackListsStore implements IStore<ITrackListsStoreState> {

  readonly state$ = new BehaviorSubject({} as ITrackListsStoreState);

  constructor(
    state$: Observable<ITrackListsStoreState>,
    private _changeState: ChangeTackListsState,
    private _api: ApiService,
    private _navigationService: NavigationService,
    private _searchStorageService: SearchStorageService
  ) {
    state$.subscribe(x => this.state$.next(x))
  }

  public init(onSuccess = noOp, onFail = noOp) {
  }

  public fetchTrackLists(params: FetchTrackListsParams, onSuccess: OnTrackListsFetched = noOp, onFail = noOp) {
    this._setLoadingField(true, 'fetchTrackLists');
    const parameters: ITrackListsFilterParameters = {
      page: params.fetchMore ? this.pagination.page + 1 : this.pagination.page,
      size: this.pagination.size,
      search: this.filter.search as string,
      authorId: this.filter.authorId as string,
      author: this.filter.author as UniqueName,
      tracksCount: this.filter.tracksCount as number,
      sort: this.filter.sort as TrackListSortField,
      order: this.filter.order as SortOrder
    };

    const response = this.trackListsForUser ?
      this._api.me.trackLists({...parameters, userId: this.filter.userId as string})
      :
      this._api.trackLists.list(parameters);

    response
      .pipe(
        finalize(() => this._setLoadingField(false, 'fetchTrackLists'))
      )
      .subscribe(
        x => {
          const items = params.fetchMore ? [...this.trackLists, ...x.items] : x.items;
          this._setTrackLists(items);
          this._setPagination({page: x.page, size: x.size, totalElements: x.totalElements, totalPages: x.totalPages});

          if (this.filter.search && x.items.length) {
            this._searchStorageService.addSearchQuery(this.filter.search as string, 'trackLists');
          }

          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public clearTrackListsAndFilter() {
    this._setTrackLists([]);
    this._setFilter(trackListsStoreFilterInitialState);
  }

  public refreshTrackLists(onSuccess: OnTrackListsFetched = noOp, onFail = noOp) {
    this._setPagination(paginationStoreInitialState);
    this.fetchTrackLists({}, onSuccess, onFail);
  }

  public fetchTrackList(id: ID, onSuccess: OnTrackListFetched = noOp, onFail = noOp) {
    this._setLoadingField(true, 'fetchTrackList');
    this._api.trackLists.get(id)
      .pipe(
        finalize(() => this._setLoadingField(false, 'fetchTrackList'))
      )
      .subscribe(
        x => {
          this._setTrackList(x);
          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public clearTrackList() {
    this._setTrackList(null);
  }

  public addTrackList(request: IAddTrackListRequest, image?: File, onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'addTrackList');
    this._api.trackLists.add(request, image)
      .pipe(
        finalize(() => this._setLoadingField(false, 'addTrackList'))
      )
      .subscribe(
        () => {
          this.refreshTrackLists();
          this._navigationService.toTrackLists();
          onSuccess();
        },
        () => {
          onFail();
        }
      );
  }

  public updateTrackList(id: ID, request: IUpdateTrackListRequest, image?: File, onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'updateTrackList');
    this._api.trackLists.update(id, request, image)
      .pipe(
        finalize(() => this._setLoadingField(false, 'updateTrackList'))
      )
      .subscribe(
        () => {
          this.refreshTrackLists();
          this._navigationService.toTrackLists();
          onSuccess();
        },
        () => {
          onFail();
        }
      );
  }

  public deleteTrackList(id: ID, onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'deleteTrackList');
    this._api.trackLists.delete(id)
      .pipe(
        finalize(() => this._setLoadingField(false, 'deleteTrackList'))
      )
      .subscribe(
        () => {
          this.refreshTrackLists();
          onSuccess();
        },
        () => {
          onFail();
        }
      );
  }

  public checkName(name: UniqueName, trackListId?: ID): Observable<boolean> {
    this._setLoadingField(true, 'checkName');
    return this._api.trackLists.checkExistsByName(name, trackListId)
      .pipe(
        finalize(() => this._setLoadingField(false, 'checkName'))
      );
  }

  public likeTrackList(id: ID, onSuccess: OnLiked = noOp, onFail = noOp) {
    this._setLoadingField(true, 'likeTrackList');
    this._api.trackLists.like(id)
      .pipe(
        finalize(() => this._setLoadingField(false, 'likeTrackList'))
      )
      .subscribe(
        x => {
          this._setLikedTrackList(id, x);
          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public saveTrackList(id: ID, onSuccess: OnSaved = noOp, onFail = noOp) {
    this._setLoadingField(true, 'saveTrackList');
    this._api.trackLists.save(id)
      .pipe(
        finalize(() => this._setLoadingField(false, 'saveTrackList'))
      )
      .subscribe(
        x => {
          this._setSavedTrackList(id, { saved: x });
          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public removeSearchQuery(searchQuery: string) {
    this._searchStorageService.removeQuery(searchQuery, 'trackLists');
  }

  public setPageParams(value: number, key: 'page' | 'size') {
    const pagination = {...this.pagination};
    pagination[key] = value;
    this._setPagination(pagination);
  }

  private _setPagination(pagination: IStorePaginationState) {
    this._changeState({...this.state$.value, pagination});
  }

  private _setFilter(filter: TrackListsStoreFilterState) {
    this._changeState({...this.state$.value, filter});
  }

  public setFilterField(value: TrackListsStoreFilterValue, key: TrackListsStoreFilterField) {
    const filter = {...this.filter};
    filter[key] = value;
    this._setFilter(filter);
  }

  public setDialogField(value: TrackListsStoreDialogValue, key: TrackListsStoreDialogField) {
    const dialog = {...this.dialog};
    dialog[key] = value;
    this._changeState({...this.state$.value, dialog});
  }

  private _setTrackLists(trackLists: ITrackListItem[]) {
    this._changeState({...this.state$.value, trackLists});
  }

  private _setTrackList(trackList: ITrackListResponse | null) {
    this._changeState({...this.state$.value, trackList});
  }

  private _setLikedTrackList(id: ID, likedTrackList: ILikedItem) {
    const likedTrackLists = {...this.likedTrackLists};
    likedTrackLists[id] = likedTrackList;
    this._changeState({...this.state$.value, likedTrackLists});
  }

  private _setSavedTrackList(id: ID, savedTrackList: ISavedItem) {
    const savedTrackLists = {...this.savedTrackLists};
    savedTrackLists[id] = savedTrackList;
    this._changeState({...this.state$.value, savedTrackLists});
  }

  private _setLoadingField(value: boolean, key: TrackListsStoreLoadingField) {
    const loading = {...this.loading};
    loading[key] = value;
    this._changeState({...this.state$.value, loading});
  }

  public setTrackListsForUser(trackListsForUser: boolean) {
    this._changeState({...this.state$.value, trackListsForUser});
  }

  public get trackListsForUser(): boolean {
    return this.state$.getValue().trackListsForUser;
  }

  public get pagination(): IStorePaginationState {
    return this.state$.getValue().pagination;
  }

  public get isLastPage(): boolean {
    return this.pagination.page >= (this.pagination.totalPages - 1);
  }

  public get filter(): TrackListsStoreFilterState {
    return this.state$.getValue().filter;
  }

  public get searchQueries(): string[] {
    return this._searchStorageService.getSearchQueries('trackLists');
  }

  public get loading(): TrackListsStoreLoadingState {
    return this.state$.getValue().loading;
  }

  public get dialog(): TrackListsStoreDialogState {
    return this.state$.getValue().dialog;
  }

  public get trackLists(): ITrackListItem[] {
    return this.state$.getValue().trackLists;
  }

  public get trackList(): ITrackListResponse | null {
    return this.state$.getValue().trackList;
  }

  public get likedTrackLists(): LikedItemsState {
    return this.state$.getValue().likedTrackLists;
  }

  public get savedTrackLists(): SavedItemsState {
    return this.state$.getValue().savedTrackLists;
  }

}
