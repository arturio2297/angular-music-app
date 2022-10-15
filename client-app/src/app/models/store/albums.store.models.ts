import {DialogState, IStorePaginationState, LikedItemsState, LoadingState, SavedItemsState} from "./store.models";
import {IGroupItem} from "../api/groups.models";
import {IAlbumResponse, IAlbumItem} from "../api/albums.models";

export type AlbumsStoreLoadingField = 'fetchAlbums' | 'fetchAlbum' | 'addAlbum' | 'updateAlbum' | 'deleteAlbum'
  | 'checkName' | 'searchGroups' | 'likeAlbum' | 'saveAlbum';
export type AlbumsStoreLoadingState = LoadingState<AlbumsStoreLoadingField>;

export type AlbumsStoreDialogField = 'deleteAlbum';
export type AlbumsStoreDialogValue = boolean | {} | null;
export type AlbumsStoreDialogState = DialogState<AlbumsStoreDialogField, AlbumsStoreDialogValue>;

export type AlbumsStoreFilterField = 'search' | 'groupId' | 'userId' | 'tracksCount';
export type AlbumsStoreFilterValue = string | number;
export type AlbumsStoreFilterState = Record<AlbumsStoreFilterField, AlbumsStoreFilterValue>;

export interface IAlbumStoreSearchState {
  groups: IGroupItem[];
}

export interface IAlbumsStoreState {
  loading: AlbumsStoreLoadingState;
  dialog: AlbumsStoreDialogState;
  albumsForUser: boolean;
  albums: IAlbumItem[];
  pagination: IStorePaginationState;
  filter: AlbumsStoreFilterState;
  search: IAlbumStoreSearchState;
  album: IAlbumResponse | null;
  likedAlbums: LikedItemsState;
  savedAlbums: SavedItemsState;
}
