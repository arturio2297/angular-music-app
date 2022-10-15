import {IAlbumItem} from "../api/albums.models";
import {IStorePaginationState} from "./store.models";
import {ITrackListItem} from "../api/track-lists.models";
import {ITrackItem} from "../api/track.models";

export type MeStoreLoadingField = 'fetchAlbums' | 'fetchTrackLists' | 'fetchTracks'
  | 'saveAlbum' | 'saveTrackList' | 'saveTrack';
export type MeStoreLoadingState = Record<MeStoreLoadingField, boolean>;

export type MeStoreAlbumsFilterField = 'search' | 'groupId';
export type MeStoreAlbumsFilterState = Record<MeStoreAlbumsFilterField, string>;

export type MeStoreTrackListsFilterField = 'search' | 'authorId';
export type MeStoreTrackListsFilterState = Record<MeStoreTrackListsFilterField, string>;

export type MeStoreTracksFilterField = 'search';
export type MeStoreTracksFilterState = Record<MeStoreTracksFilterField, string>;

export interface IMeStoreAlbumsState {
  items: IAlbumItem[];
  pagination: IStorePaginationState;
  filter: MeStoreAlbumsFilterState;
}

export interface IMeStoreTrackListsState {
  items: ITrackListItem[];
  pagination: IStorePaginationState;
  filter: MeStoreTrackListsFilterState;
}

export interface IMeStoreTracksState {
  items: ITrackItem[];
  pagination: IStorePaginationState;
  filter: MeStoreTracksFilterState;
}

export interface IMeStoreState {
  loading: MeStoreLoadingState;
  albums: IMeStoreAlbumsState,
  trackLists: IMeStoreTrackListsState,
  tracks: IMeStoreTracksState
}
