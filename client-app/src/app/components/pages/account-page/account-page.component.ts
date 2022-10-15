import {Component} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {IUpdateAccountRequest} from "../../../models/api/account.models";
import {RootStore} from "../../../stores/root.store";
import {ToastsService} from "../../../services/toasts.service";
import {AccountStore} from "../../../stores/account/account.store";

type AccountForm = { title: string, className: string };
const forms: AccountForm[] =
  [
    { title: 'Personal Data', className: 'personal-data' },
    { title: 'Change Password', className: 'change-password' },
    { title: 'Change Email', className: 'change-email' }
  ];

@Component({
  selector: 'app-account.page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.less']
})
export class AccountPageComponent {

  selectedForm$ = new BehaviorSubject<AccountForm>(forms[0]);

  constructor(
    private _rootStore: RootStore,
    private _toastsService: ToastsService
  ) {
  }

  public updatePersonalData(event: { request: IUpdateAccountRequest, avatar?: File }) {
    this._accountStore.updateAccount(
      event.request,
      event.avatar,
      () => this._toastsService.push('Personal data successfully updated', 'success')
    );
  }

  public selectForm(form: AccountForm) {
    this.selectedForm$.next(form);
  }

  public get formVariants(): AccountForm[] {
    return forms;
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

}
