import {
  IStorePaginationState,
  DialogState,
  LoadingState,
  IDialogData,
  LikedItemsState,
  SavedItemsState
} from "./store.models";
import {ITrackItem} from "../api/track.models";

export type TracksStoreLoadingField = 'fetchTracks' | 'addTrack' | 'updateTrack' | 'deleteTrack' | 'likeTrack'
  | 'saveTrack' | 'checkName' | 'fetchFile';
export type TracksStoreLoadingState = LoadingState<TracksStoreLoadingField>;

export type TracksStoreDialogField = 'addTrack' | 'updateTrack' | 'deleteTrack';
export type TracksStoreDialogValue = boolean | {} | null;
export type TracksStoreDialogState = DialogState<TracksStoreDialogField, TracksStoreDialogValue>;

export interface IAddTrackDialogData extends IDialogData {
  albumName: UniqueName;
  albumId: ID;
}

export type TracksStoreFilterField = 'search' | 'groupId' | 'albumId' | 'trackListId'
  | 'notInGroup' | 'notInAlbum' | 'notInTrackList';

export type TracksStoreFilterValue = string;
export type TracksStoreFilterState = Record<TracksStoreFilterField, TracksStoreFilterValue>;

export type TracksFor = 'all' | 'user' | 'group' | 'album' | 'track-list';

export interface ITracksStoreState {
  loading: TracksStoreLoadingState;
  dialog: TracksStoreDialogState;
  tracks: ITrackItem[];
  tracksFor: TracksFor;
  pagination: IStorePaginationState;
  filter: TracksStoreFilterState;
  likedTracks: LikedItemsState;
  savedTracks: SavedItemsState;
}
