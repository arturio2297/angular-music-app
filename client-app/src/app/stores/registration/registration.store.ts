import {
  ChangeState,
  IStore
} from "../../models/store/store.models";
import {BehaviorSubject, finalize, Observable} from "rxjs";
import {ApiService} from "../../services/api/api.service";
import {NavigationService} from "../../services/navigation.service";
import {IRegistrationRequest} from "../../models/api/registration.contracts";
import {noOp} from "../../models/common/common.models";
import {
  IRegistrationStoreState,
  RegistrationStoreLoadingField,
  RegistrationStoreLoadingState
} from "../../models/store/registration.store";

export type ChangeRegistrationState = ChangeState<IRegistrationStoreState>;

export class RegistrationStore implements IStore<IRegistrationStoreState> {

  readonly state$ = new BehaviorSubject({} as IRegistrationStoreState);

  constructor(
    state$: Observable<IRegistrationStoreState>,
    private _changeState: ChangeRegistrationState,
    private _api: ApiService,
    private _navigationService: NavigationService
  ) {
    state$.subscribe(x => this.state$.next(x))
  }

  public register(request: IRegistrationRequest, onSuccess = noOp, onFail = noOp): void {
    this._setLoadingField(true, 'registration');
    this._api.registration.register(request)
      .pipe(
        finalize(() => this._setLoadingField(false, 'registration'))
      )
      .subscribe(
        () => onSuccess(),
        () => onFail()
      );
  }

  public checkEmail(email: string): Observable<boolean> {
    this._setLoadingField(true, 'checkEmail');
    return this._api.registration.checkExistsByEmail(email)
      .pipe(
        finalize(() => this._setLoadingField(false, 'checkEmail'))
      );
  }

  public checkUsername(username: string): Observable<boolean> {
    this._setLoadingField(true, 'checkUsername');
    return this._api.registration.checkExistsByUsername(username)
      .pipe(
        finalize(() => this._setLoadingField(false, 'checkUsername'))
      );
  }

  private _setLoadingField(value: boolean, key: RegistrationStoreLoadingField) {
    const loading = {...this.state$.value.loading}
    loading[key] = value;
    this.state$.next({...this.state$, loading})
  }

  public get loading(): RegistrationStoreLoadingState {
    return this.state$.getValue().loading;
  }

}
