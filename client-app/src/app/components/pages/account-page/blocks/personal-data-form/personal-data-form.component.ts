import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import AdditionalValidators from "../../../../../validation/control.validators";
import {BehaviorSubject} from "rxjs";
import {RootStore} from "../../../../../stores/root.store";
import {CropImageService} from "../../../../../services/crop.image.service";
import {IAccountResponse, IUpdateAccountRequest} from "../../../../../models/api/account.models";
import {AccountStore} from "../../../../../stores/account/account.store";
import {ImageControlValue} from "../../../../../models/controls/control.models";
import {ApiService} from "../../../../../services/api/api.service";
import {AccountStoreLoadingState} from "../../../../../models/store/account.store.models";

@Component({
  selector: 'app-personal-data-form',
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.less']
})
export class PersonalDataFormComponent {

  @Output()
  onFormSubmit = new EventEmitter<{ request: IUpdateAccountRequest, avatar?: File }>();

  form = new FormGroup({
    username: new FormControl(this.account.username, {
      validators: [Validators.required, Validators.maxLength(32)],
      asyncValidators: [AdditionalValidators.checkUserExistsByUsername(x => this._accountStore.checkUsername(x))],
      updateOn: 'blur',
    }),
    firstname: new FormControl(this.account.firstname, Validators.maxLength(32)),
    lastname: new FormControl(this.account.lastname, Validators.maxLength(32)),
    avatar: new FormControl<ImageControlValue | null>(null)
  })

  warning$ = new BehaviorSubject(false);

  constructor(
    private _rootStore: RootStore,
    private _cropImageService: CropImageService,
    private _api: ApiService
  ) {
  }

  public onSubmit() {
    this.warning$.next(this.form.invalid);
    if (this.form.valid) {
      const {username, firstname, lastname, avatar} = this.controls;

      const request: IUpdateAccountRequest = {
        username: username.value as string,
        firstname: firstname.value as string,
        lastname: lastname.value as string,
      };

      if (avatar.value) {
        request.avatar = { base64: avatar.value!.base64, filename: avatar.value!.filename }
      }

      this.onFormSubmit.emit({request});
    }
  }

  public startCropAvatar() {
    this._cropImageService.startCrop(
      (base64, filename) => this.form.controls.avatar.setValue({base64, filename})
    );
  }

  public resetAvatar() {
    this.form.controls.avatar.setValue(null);
  }

  public get loading(): AccountStoreLoadingState {
    return this._accountStore.loading;
  }

  public get account(): IAccountResponse {
    return this._accountStore.account as IAccountResponse;
  }

  public get controls() {
    return this.form.controls;
  }

  public get avatarUrl() {
    return this._api.accountAvatarUrl(this.account.id);
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

}
