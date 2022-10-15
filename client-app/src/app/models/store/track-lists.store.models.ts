import {DialogState, IStorePaginationState, LikedItemsState, LoadingState, SavedItemsState} from "./store.models";
import {ITrackListItem, ITrackListResponse} from "../api/track-lists.models";

export type TrackListsStoreLoadingField = 'fetchTrackLists' | 'fetchTrackList' | 'addTrackList' | 'updateTrackList'
  | 'deleteTrackList' | 'checkName' | 'likeTrackList' | 'saveTrackList';
export type TrackListsStoreLoadingState = LoadingState<TrackListsStoreLoadingField>;

export type TrackListsStoreDialogField = 'deleteTrackList';
export type TrackListsStoreDialogValue = boolean | {} | null;
export type TrackListsStoreDialogState = DialogState<TrackListsStoreDialogField, TrackListsStoreDialogValue>;

export type TrackListsStoreFilterField = 'search' | 'authorId' | 'userId' | 'tracksCount' | 'author' | 'sort' | 'order';
export type TrackListsStoreFilterValue = string | number;
export type TrackListsStoreFilterState = Record<TrackListsStoreFilterField, TrackListsStoreFilterValue>;

export interface ITrackListsStoreState {
  loading: TrackListsStoreLoadingState,
  dialog: TrackListsStoreDialogState,
  trackListsForUser: boolean;
  trackLists: ITrackListItem[];
  pagination: IStorePaginationState;
  filter: TrackListsStoreFilterState;
  trackList: ITrackListResponse | null;
  likedTrackLists: LikedItemsState;
  savedTrackLists: SavedItemsState;
}
