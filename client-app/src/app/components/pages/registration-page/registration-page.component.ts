import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import AdditionalValidators from "../../../validation/control.validators";
import {RootStore} from "../../../stores/root.store";
import {IRegistrationRequest} from "../../../models/api/registration.contracts";
import {AccountStore} from "../../../stores/account/account.store";
import {RegistrationStore} from "../../../stores/registration/registration.store";
import {RegistrationStoreLoadingState} from "../../../models/store/registration.store";
import {NavigationService} from "../../../services/navigation.service";
import {ToastsService} from "../../../services/toasts.service";

const validationMessages = {
  passwordRepeat: {
    sameEqual: 'Passwords values must be the same'
  }
}

@Component({
  selector: 'app-registration.page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.less']
})
export class RegistrationPageComponent {

  readonly form = new FormGroup({
    email: new FormControl('', {
        validators: [Validators.email, Validators.required],
        asyncValidators: [AdditionalValidators.checkUserExistsByEmail(email => this._registrationStore.checkEmail(email))],
        updateOn: 'blur'
      }
    ),
    username: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(32)],
      asyncValidators: [AdditionalValidators.checkUserExistsByUsername(username => this._registrationStore.checkUsername(username))],
      updateOn: 'blur'
    }),
    firstname: new FormControl('', [Validators.maxLength(32)]),
    lastname: new FormControl('', [Validators.maxLength(32)]),
    password: new FormControl('', [Validators.required]),
    passwordRepeat: new FormControl('', [Validators.required])
  },
    [AdditionalValidators.same('passwordRepeat', 'password')]
  )

  readonly warning$ = new BehaviorSubject(false);

  constructor(
    private _rootStore: RootStore,
    public navigationService: NavigationService,
    private _toastsService: ToastsService
  ) { }

  public onSubmit() {
    this.warning$.next(this.form.invalid);
    if (this.form.valid) {
      const request = {} as IRegistrationRequest;
      request.email = this.form.controls.email.value as string;
      request.username = this.form.controls.username.value as string;
      const firstname = this.form.controls.firstname.value;
      firstname && (request.firstname = firstname);
      const lastname = this.form.controls.lastname.value;
      lastname && (request.lastname = lastname);
      request.password = this.form.controls.password.value as string;
      this._registrationStore.register(
        request,
        () => {
          this._toastsService.push('Registration completed successfully', 'success');
          this._accountStore.login(request.email, request.password);
        }
      )
    }
  }

  public get validationMessagesOptions() {
    return validationMessages;
  }

  public get loading(): RegistrationStoreLoadingState {
    return this._registrationStore.loading;
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

  private get _registrationStore(): RegistrationStore {
    return this._rootStore.registrationStore;
  }

}
