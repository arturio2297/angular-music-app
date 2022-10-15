import {Component, OnInit} from '@angular/core';
import {AccountStore} from "../../../../stores/account/account.store";
import {RootStore} from "../../../../stores/root.store";
import {ToastsService} from "../../../../services/toasts.service";

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.less']
})
export class LogoutDialogComponent implements OnInit {

  private _accountStore: AccountStore;

  constructor(
    rootStore: RootStore,
    private _toastsService: ToastsService
  ) {
    this._accountStore = rootStore.accountStore;
  }

  ngOnInit(): void {
  }

  public onClose() {
    this._accountStore.setDialogField(false, 'logout');
  }

  public onLogout() {
    this._accountStore.logout();
    this.onClose();
    this._toastsService.push('Logout successfully', 'success');
  }

}
