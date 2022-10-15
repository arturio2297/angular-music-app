import {LoadingState} from "./store.models";
import {IGenreItem} from "../api/genres.models";

export type GenresStoreLoadingField = 'fetchGenres';
export type GenresStoreLoadingState = LoadingState<GenresStoreLoadingField>;

export type GenresStoreFilterField = 'search';
export type GenresStoreFilterValue = string;
export type GenresStoreFilterState = Record<GenresStoreFilterField, GenresStoreFilterValue>;

export interface IGenresStoreState {
  loading: GenresStoreLoadingState;
  filter: GenresStoreFilterState;
  genres: IGenreItem[];
}
