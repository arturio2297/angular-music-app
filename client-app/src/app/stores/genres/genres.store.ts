import {IGenreItem} from "../../models/api/genres.models";
import {BehaviorSubject, finalize, Observable} from "rxjs";
import {
  GenresStoreFilterField, GenresStoreFilterState,
  GenresStoreFilterValue,
  GenresStoreLoadingField,
  GenresStoreLoadingState,
  IGenresStoreState
} from "../../models/store/gernes.store.models";
import {ChangeState, IStore} from "../../models/store/store.models";
import {ApiService} from "../../services/api/api.service";
import {SearchStorageService} from "../../services/storage/search.storage.service";
import {NavigationService} from "../../services/navigation.service";
import {noOp} from "../../models/common/common.models";
import {genresStoreFilterInitialState} from "../root.store";
import {OnFetched} from "../../models/api/coomon.models";

export type OnGenresFetched = OnFetched<IGenreItem[]>;

export type ChangeGenresState = ChangeState<IGenresStoreState>;

export class GenresStore implements IStore<IGenresStoreState> {

  readonly state$ = new BehaviorSubject({} as IGenresStoreState);

  constructor(
    state$: Observable<IGenresStoreState>,
    private _changeState: ChangeGenresState,
    private _api: ApiService,
    private _navigationService: NavigationService,
    private _searchStorageService: SearchStorageService
  ) {
    state$.subscribe(x => this.state$.next(x));
  }

  public fetchGenres(onSuccess: OnGenresFetched, onFail = noOp) {
    this._setLoadingField(true, 'fetchGenres');
    this._api.genres.list(this.filter.search)
      .pipe(
        finalize(() => this._setLoadingField(false, 'fetchGenres'))
      )
      .subscribe(
        x => {
          this._setGenres(x);
          if (x.length) {
            this._searchStorageService.addSearchQuery(this.filter.search, 'genres');
          }
          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  public clearGenres() {
    this._setGenres([]);
  }

  public clearGenresAndFilters() {
    this._setFilter(genresStoreFilterInitialState);
    this._setGenres([]);
  }

  public removeSearchQuery(searchQuery: string) {
    this._searchStorageService.removeQuery(searchQuery, 'genres');
  }

  public setFilterField(value: GenresStoreFilterValue, key: GenresStoreFilterField) {
    const filter = {...this.filter};
    filter[key] = value;
    this._changeState({...this.state$.value, filter});
  }

  private _setFilter(filter: GenresStoreFilterState) {
    this._changeState({...this.state$.value, filter});
  }

  private _setGenres(genres: IGenreItem[]) {
    this._changeState({...this.state$.value, genres});
  }

  private _setLoadingField(value: boolean, key: GenresStoreLoadingField) {
    const loading = {...this.loading};
    loading[key] = value;
    this._changeState({...this.state$.value, loading});
  }

  public get loading(): GenresStoreLoadingState {
    return this.state$.getValue().loading;
  }

  public get filter(): GenresStoreFilterState {
    return this.state$.getValue().filter;
  }

  public get searchQueries(): string[] {
    return this._searchStorageService.getSearchQueries('genres');
  }

  public get genres(): IGenreItem[] {
    return this.state$.getValue().genres;
  }

}
