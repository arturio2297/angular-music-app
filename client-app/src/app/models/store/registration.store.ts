import {LoadingState} from "./store.models";

export type RegistrationStoreLoadingField = 'registration' | 'checkEmail' | 'checkUsername';
export type RegistrationStoreLoadingState = LoadingState<RegistrationStoreLoadingField>;

export interface IRegistrationStoreState {
  loading: RegistrationStoreLoadingState;
}
