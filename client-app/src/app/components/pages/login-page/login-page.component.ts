import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {RootStore} from "../../../stores/root.store";
import {ToastsService} from "../../../services/toasts.service";
import {AccountStore} from "../../../stores/account/account.store";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent {

  readonly form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  readonly warning$ = new BehaviorSubject(false);

  constructor(
    private _rootStore: RootStore,
    private _toastsService: ToastsService
  ) {
  }

  public onSubmit() {
    this.warning$.next(this.form.invalid);
    if (this.form.valid) {
      const email = this.form.controls.email.value as string;
      const password = this.form.controls.password.value as string;
      this._accountStore.login(
        email,
        password,
        () => this._toastsService.push('Login successfully', 'success')
      );
    }
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

}
