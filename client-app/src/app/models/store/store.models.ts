import {BehaviorSubject} from "rxjs";
import {Action} from "../common/common.models";
import {IAccountStoreState} from "./account.store.models";
import {IRegistrationStoreState} from "./registration.store";
import {IUiStoreState} from "./ui.store.models";
import {IGroupsStoreState} from "./groups.store.models";
import {IAlbumsStoreState} from "./albums.store.models";
import {IAudioPlayerStoreState} from "./player.store.models";
import {ITracksStoreState} from "./tracks.store.models";
import {ITrackListsStoreState} from "./track-lists.store.models";
import {IMeStoreState} from "./me.store.models";
import {IGenresStoreState} from "./gernes.store.models";

export type LoadingState<T extends string> = Record<T, boolean>;
export type DialogState<T1 extends  string, T2> = Record<T1, T2>;

export interface ISavedItem {
  saved: boolean;
}
export type SavedItemsState = Record<ID, ISavedItem>;

export interface ILikedItem {
  liked: boolean;
  likesCount: number;
}
export type LikedItemsState = Record<ID, ILikedItem>;

export interface IDialogData {
  onSuccess?: Action;
  onFail?: Action;
}

export interface IRemoveDialogData extends IDialogData {
  id: ID;
  name: UniqueName;
}

export interface IEditDialogData<T> extends IDialogData {
  item: T;
}

export interface IStorePaginationState {
  size: number;
  page: number;
  totalElements: number;
  totalPages: number;
}

export interface IRootState {
  uiState: IUiStoreState;
  accountState: IAccountStoreState;
  registrationState: IRegistrationStoreState;
  groupsState: IGroupsStoreState;
  albumsState: IAlbumsStoreState;
  tracksState: ITracksStoreState;
  genresState: IGenresStoreState,
  playerState: IAudioPlayerStoreState;
  trackListsState: ITrackListsStoreState;
  meState: IMeStoreState;
}

export interface IStore<T extends {}> {
  readonly state$: BehaviorSubject<T>;
  init?: (onSuccess?: Action, onFail?: Action, ...args: any[]) => void;
}

export type ChangeState<T> = (state: T) => void;
