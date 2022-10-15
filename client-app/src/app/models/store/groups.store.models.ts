import {DialogState, IStorePaginationState, LoadingState} from "./store.models";
import {IGroupResponse, IGroupItem} from "../api/groups.models";

export type GroupsStoreLoadingField = 'fetchGroups' | 'fetchGroup' | 'addGroup' | 'updateGroup' | 'deleteGroup' |'checkName';
export type GroupsStoreLoadingState = LoadingState<GroupsStoreLoadingField>;

export type GroupsStoreDialogKeys = 'deleteGroup';
export type GroupsStoreDialogValue = boolean | {} | null;
export type GroupsStoreDialogState = DialogState<GroupsStoreDialogKeys, GroupsStoreDialogValue>;

export type GroupsStoreFilterField = 'search' | 'tracksCount';
export type GroupsStoreFilterValue = string | number;
export type GroupsStoreFilterState = Record<GroupsStoreFilterField, GroupsStoreFilterValue>;

export interface IGroupsStoreState {
  loading: GroupsStoreLoadingState;
  dialog: GroupsStoreDialogState;
  groups: IGroupItem[];
  pagination: IStorePaginationState;
  filter: GroupsStoreFilterState;
  group: IGroupResponse | null;
}
