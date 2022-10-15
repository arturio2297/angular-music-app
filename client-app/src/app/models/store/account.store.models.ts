import {DialogState, LoadingState} from "./store.models";
import {IAccountResponse} from "../api/account.models";

export type AccountStoreLoadingField = 'login' | 'fetchAccount' | 'refresh' | 'updateAccount' | 'checkUsername' | 'checkEmail';
export type AccountStoreLoadingState = LoadingState<AccountStoreLoadingField>;

export type AccountStoreDialogField = 'logout';
export type AccountStoreDialogValue = boolean;
export type AccountStoreDialogState = DialogState<AccountStoreDialogField, AccountStoreDialogValue>;

export interface IAccountStoreState {
  account: IAccountResponse | null;
  loading: AccountStoreLoadingState;
  dialog: AccountStoreDialogState;
}
