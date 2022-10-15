import {Component} from '@angular/core';
import {RootStore} from "../../../../stores/root.store";
import {AccountStore} from "../../../../stores/account/account.store";
import {BehaviorSubject} from "rxjs";
import {NavigationService} from "../../../../services/navigation.service";
import {IAccountResponse} from "../../../../models/api/account.models";
import {ApiService} from "../../../../services/api/api.service";

@Component({
  selector: 'app-account-actions',
  templateUrl: './account-actions.component.html',
  styleUrls: ['./account-actions.component.less']
})
export class AccountActionsComponent {

  showActions$ = new BehaviorSubject(false);
  actionsClosed$ = new BehaviorSubject(false);

  constructor(
    private _rootStore: RootStore,
    private _navigationService: NavigationService,
    private _apiService: ApiService
  ) { }

  public openActions() {
    this.showActions$.next(true);
  }

  public closeActions() {
    this.actionsClosed$.next(true);
    setTimeout(() => {
      this.showActions$.next(false);
      this.actionsClosed$.next(false);
    }, 200);
  }

  public onLogoutClick() {
    this._accountStore.setDialogField(true, 'logout');
  }

  public navigateToAccount() {
    return this._navigationService.toAccount();
  }

  public get isAccountPage() {
    return this._navigationService.is.accountPage;
  }

  public get account(): IAccountResponse {
    return this._accountStore.account as IAccountResponse;
  }

  public get avatarUrl(): string {
    return this._apiService.accountAvatarUrl(this.account.id);
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

}
