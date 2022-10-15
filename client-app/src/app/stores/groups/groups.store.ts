import {
  ChangeState,
  IStore, IStorePaginationState
} from "../../models/store/store.models";
import {BehaviorSubject, finalize, Observable} from "rxjs";
import {ApiService} from "../../services/api/api.service";
import {NavigationService} from "../../services/navigation.service";
import {noOp} from "../../models/common/common.models";
import {
  IAddGroupRequest,
  IGroupResponse,
  IGroupItem,
  IUpdateGroupRequest,
  IGroupsFilterParameters
} from "../../models/api/groups.models";
import {groupsStoreFilterInitialState, paginationStoreInitialState} from "../root.store";
import {
  GroupsStoreDialogKeys,
  GroupsStoreDialogState, GroupsStoreDialogValue, GroupsStoreFilterField,
  GroupsStoreFilterState, GroupsStoreFilterValue,
  GroupsStoreLoadingField,
  GroupsStoreLoadingState,
  IGroupsStoreState
} from "../../models/store/groups.store.models";
import {SearchStorageService} from "../../services/storage/search.storage.service";
import {OnFetched, OnPageFetched} from "../../models/api/coomon.models";

export interface IFetchGroupsParams {
  fetchMore?: boolean;
}

export type OnGroupsFetched = OnPageFetched<IGroupItem>;

export type OnGroupFetched = OnFetched<IGroupResponse>;

export type ChangeGroupsState = ChangeState<IGroupsStoreState>;

export class GroupsStore implements IStore<IGroupsStoreState> {

  readonly state$ = new BehaviorSubject({} as IGroupsStoreState);

  constructor(
    state$: Observable<IGroupsStoreState>,
    private _changeState: ChangeGroupsState,
    private _api: ApiService,
    private _navigationService: NavigationService,
    private _searchStorageService: SearchStorageService
  ) {
    state$.subscribe(x => this.state$.next(x));
  }

  public init(onSuccess = noOp, onFail = noOp) {
    this.refreshGroups(onSuccess, onFail);
  }

  public fetchGroups(params: IFetchGroupsParams, onSuccess: OnGroupsFetched = noOp, onFail = noOp) {
    this._setLoadingField(true, 'fetchGroups');
    const parameters: IGroupsFilterParameters = {
      page: params.fetchMore ? this.pagination.page + 1 : this.pagination.page,
      size: this.pagination.size,
      search: this.filter.search as string,
      tracksCount: this.filter.tracksCount as number
    };
    this._api.groups.list(parameters)
      .pipe(
        finalize(() => this._setLoadingField(false, 'fetchGroups'))
      )
      .subscribe(
        x => {
          const items = params.fetchMore ? [...this.groups, ...x.items] : x.items;
          this._setGroups(items);
          this._setPagination({page: x.page, size: x.size, totalPages: x.totalPages, totalElements: x.totalElements});

          if (this.filter.search && items.length) {
            this._searchStorageService.addSearchQuery(this.filter.search as string, 'groups');
          }

          onSuccess(x);
        },
        () => {
          onFail()
        }
      );
  }

  public clearGroups() {
    this._setGroups([]);
  }

  public clearGroupsAndFilters() {
    this._setGroups([]);
    this._setFilter(groupsStoreFilterInitialState);
  }

  public refreshGroups(onSuccess = noOp, onFail = noOp) {
    this._setPagination(paginationStoreInitialState);
    this.fetchGroups({}, onSuccess, onFail);
  }

  public fetchGroup(id: ID, onSuccess: OnGroupFetched = noOp, onFail = noOp) {
    this._setLoadingField(true, 'fetchGroup');
    this._api.groups.get(id)
      .pipe(
        finalize(() => this._setLoadingField(false, 'fetchGroup'))
      )
      .subscribe(
        x => {
          this._setGroup(x);
          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public clearGroup() {
    this._setGroup(null);
  }

  public addGroup(request: IAddGroupRequest, image?: File, onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'addGroup');
    this._api.groups.add(request, image)
      .pipe(
        finalize(() => this._setLoadingField(false, 'addGroup'))
      )
      .subscribe(
        () => {
          this.refreshGroups();
          this._navigationService.toGroups();
          onSuccess();
        },
        () => {
          onFail();
        }
      )
  }

  public updateGroup(id: ID, request: IUpdateGroupRequest, image?: File, onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'updateGroup');
    this._api.groups.update(id, request, image)
      .pipe(
        finalize(() => this._setLoadingField(false, 'updateGroup'))
      )
      .subscribe(
        () => {
          this.refreshGroups();
          this._navigationService.toGroups();
          onSuccess();
        },
        () => {
          onFail()
        }
      );
  }

  public checkName(name: UniqueName, id?: ID): Observable<boolean> {
    this._setLoadingField(true, 'checkName');
    return this._api.groups.checkExistsByName(name, id)
      .pipe(
        finalize(() => this._setLoadingField(false, 'checkName'))
      );
  }

  public deleteGroup(id: ID, onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'deleteGroup');
    this._api.groups.delete(id)
      .pipe(
        finalize(() => this._setLoadingField(false, 'deleteGroup'))
      )
      .subscribe(
        () => {
          this.refreshGroups();
          onSuccess();
        },
        () => {
          onFail();
        }
      );
  }

  public removeSearchQuery(searchQuery: string) {
    this._searchStorageService.removeQuery(searchQuery, 'groups');
  }

  public setDialogField(value: GroupsStoreDialogValue, key: GroupsStoreDialogKeys) {
    const dialog = {...this.state$.value.dialog};
    dialog[key] = value;
    this._changeState({...this.state$.value, dialog});
  }

  private _setFilter(filter: GroupsStoreFilterState) {
    this._changeState({...this.state$.value, filter});
  }

  public setFilterField(value: GroupsStoreFilterValue, key: GroupsStoreFilterField) {
    const filter = {...this.filter};
    filter[key] = value;
    this._setFilter(filter);
  }

  public setPageParams(value: number, key: 'page' | 'size') {
    const pagination = {...this.pagination};
    pagination[key] = value;
    this._setPagination(pagination);
  }

  public _setPagination(pagination: IStorePaginationState) {
    this._changeState({...this.state$.value, pagination});
  }

  private _setLoadingField(value: boolean, key: GroupsStoreLoadingField) {
    const loading = {...this.state$.value.loading};
    loading[key] = value;
    this._changeState({...this.state$.value, loading});
  }

  private _setGroups(groups: IGroupItem[]) {
    this._changeState({...this.state$.value, groups});
  }

  private _setGroup(group: IGroupResponse | null) {
    this._changeState({...this.state$.value, group});
  }

  public get loading(): GroupsStoreLoadingState {
    return this.state$.getValue().loading;
  }

  public get filter(): GroupsStoreFilterState {
    return this.state$.getValue().filter;
  }

  public get searchQueries(): string[] {
    return this._searchStorageService.getSearchQueries('groups');
  }

  public get isLastPage(): boolean {
    return this.pagination.page >= (this.pagination.totalPages - 1);
  }

  public get pagination(): IStorePaginationState {
    return this.state$.getValue().pagination;
  }

  public get dialog(): GroupsStoreDialogState {
    return this.state$.getValue().dialog;
  }

  public get groups(): IGroupItem[] {
    return this.state$.getValue().groups;
  }

  public get group(): IGroupResponse | null {
    return this.state$.getValue().group;
  }

}
