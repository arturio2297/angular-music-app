import {ChangeState, IStore} from "../../models/store/store.models";
import {BehaviorSubject, finalize, Observable} from "rxjs";
import {ApiService} from "../../services/api/api.service";
import {AuthStorageService} from "../../services/storage/auth.storage.service";
import {IAccountResponse, IUpdateAccountRequest, UserRole} from "../../models/api/account.models";
import {NavigationService} from "../../services/navigation.service";
import {noOp} from "../../models/common/common.models";
import {
  AccountStoreDialogField,
  AccountStoreDialogState,
  AccountStoreDialogValue,
  AccountStoreLoadingField,
  AccountStoreLoadingState,
  IAccountStoreState
} from "../../models/store/account.store.models";
import {RootStore} from "../root.store";

export type ChangeAccountState = ChangeState<IAccountStoreState>;

export class AccountStore implements IStore<IAccountStoreState> {

  readonly state$ = new BehaviorSubject({} as IAccountStoreState);

  constructor(
    private _root: RootStore,
    state$: Observable<IAccountStoreState>,
    private _changeState: ChangeAccountState,
    private _api: ApiService,
    private _authStorage: AuthStorageService,
    private _navigationService: NavigationService
  ) {
    state$.subscribe(x => this.state$.next(x));
  }

  public init(onSuccess = noOp, onFail = noOp) {
    const status = this._authStorage.getStatus();
    console.debug('auth status', status);
    switch (status) {
      case "ok":
        this._fetchAccount(onSuccess, onFail);
        break;
      case "accessExpired":
        this._refresh(onSuccess, onFail);
        break;
      case "refreshExpired":
        this._refresh(onSuccess, onFail);
        break;
    }
  }

  public login(email: string, password: string, onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'login');
    this._api.auth.login(email, password)
      .pipe(
        finalize(() => this._setLoadingField(false, 'login'))
      )
      .subscribe(
        x => {
          this._authStorage.setAuth(x);
          this._fetchAccount(
            () => {
              this._root.handleLogin();
              onSuccess();
            },
            onFail
          );
        },
        () => {
          onFail();
        }
      );
  }

  private _fetchAccount(onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'fetchAccount');
    this._api.account.get()
      .pipe(
        finalize(() => this._setLoadingField(false, 'fetchAccount'))
      )
      .subscribe(
        x => {
          this.setAccount(x);
          this._navigationService.handleLogin();
          onSuccess();
        },
        () => {
          onFail();
        }
      );
  }

  public updateAccount(request: IUpdateAccountRequest, avatar?: File, onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'updateAccount');
    this._api.account.update(request, avatar)
      .pipe(
        finalize(() => this._setLoadingField(false, 'updateAccount'))
      )
      .subscribe(
        x => {
          this.setAccount(x);
          onSuccess();
        },
        () => {
          onFail()
        }
      );
  }

  public checkUsername(username: string): Observable<boolean> {
    this._setLoadingField(true, 'checkUsername');
    return this._api.account.checkExistsByUsername(username)
      .pipe(
        finalize(() => this._setLoadingField(false, 'checkUsername'))
      );
  }

  public checkEmail(email: string): Observable<boolean> {
    this._setLoadingField(true, 'checkEmail');
    return this._api.account.checkExistsByEmail(email)
      .pipe(
        finalize(() => this._setLoadingField(false, 'checkEmail'))
      );
  }

  private _refresh(onSuccess = noOp, onFail = noOp) {
    this._setLoadingField(true, 'refresh');
    this._api.auth.refresh(this._authStorage.getRefreshToken() as string)
      .pipe(
        finalize(() => this._setLoadingField(false, 'refresh'))
      )
      .subscribe(
        () => this._fetchAccount(onSuccess, onFail),
        () => this._authStorage.removeAuth()
      );
  }

  public logout() {
    this._root.handleLogout();
  }

  private _setLoadingField(value: boolean, key: AccountStoreLoadingField) {
    const loading = {...this.state$.value.loading};
    loading[key] = value;
    this._changeState({...this.state$.value, loading});
  }

  public setDialogField(value: AccountStoreDialogValue, key: AccountStoreDialogField) {
    const dialog = {...this.state$.value.dialog};
    dialog[key] = value;
    this._changeState({...this.state$.value, dialog});
  }

  private setAccount(account: IAccountResponse) {
    this._changeState({...this.state$.value, account: account});
  }

  public get account(): IAccountResponse | null {
    return this.state$.getValue().account;
  }

  public get loading(): AccountStoreLoadingState {
    return this.state$.getValue().loading;
  }

  public get anyLoading(): boolean {
    const loading = this.state$.value.loading;
    return loading.fetchAccount || loading.login || loading.refresh;
  }

  public get dialog(): AccountStoreDialogState {
    return this.state$.getValue().dialog;
  }

  public get isAdmin(): boolean {
    return !!this.state$.value.account && this.state$.value.account.role === UserRole.Admin;
  }

  public get isModerator(): boolean {
    return !!this.state$.value.account && this.state$.value.account.role === UserRole.Moderator;
  }

  public get isUser(): boolean {
    return !!this.state$.value.account && this.state$.value.account.role === UserRole.User;
  }

  public get permissions() {
    return {
      groups: {
        create: this.isAdmin || this.isModerator,
        remove: this.isAdmin || this.isModerator,
        edit: this.isAdmin || this.isModerator
      },
      albums: {
        create: this.isAdmin || this.isModerator,
        remove: this.isAdmin || this.isModerator,
        edit: this.isAdmin || this.isModerator
      },
      trackLists: {
        create: true,
        edit: (authorId: ID) => {
          if (!this.isUser) return true;
          return (this.account as IAccountResponse).id === authorId;
        },
        remove: (authorId: ID) => {
          if (!this.isUser) return true;
          return (this.account as IAccountResponse).id === authorId;
        }
      }
    }
  }

}
