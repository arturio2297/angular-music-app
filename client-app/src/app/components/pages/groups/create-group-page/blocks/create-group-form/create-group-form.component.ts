import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ImageControlValue} from "../../../../../../models/controls/control.models";
import {BehaviorSubject} from "rxjs";
import {RootStore} from "../../../../../../stores/root.store";
import {CropImageService} from "../../../../../../services/crop.image.service";
import {GroupsStore} from "../../../../../../stores/groups/groups.store";
import AdditionalValidators from "../../../../../../validation/control.validators";
import {IAddGroupRequest} from "../../../../../../models/api/groups.models";
import { GroupsStoreLoadingState } from 'src/app/models/store/groups.store.models';

export type CreateGroupFormEvent = { request: IAddGroupRequest, image?: File };

@Component({
  selector: 'app-create-group-form',
  templateUrl: './create-group-form.component.html',
  styleUrls: ['./create-group-form.component.less']
})
export class CreateGroupFormComponent {

  @Output()
  onFormSubmit = new EventEmitter<CreateGroupFormEvent>();

  form = new FormGroup({
    name: new FormControl<UniqueName>('', {
      validators: [Validators.required, Validators.maxLength(32)],
      asyncValidators: AdditionalValidators.checkGroupExistsByName(x => this._groupsStore.checkName(x)),
      updateOn: 'blur'
    }),
    additionalInfo: new FormControl<string>(''),
    image: new FormControl<ImageControlValue>(null)
  }, {
    // validators: AdditionalValidators.imageRequired('image'),
    updateOn: 'submit'
  });

  warning$ = new BehaviorSubject(false);

  constructor(
    private _rootStore: RootStore,
    private _cropImageService: CropImageService
  ) {
  }

  public onSubmit() {
    this.warning$.next(this.form.invalid);
    if (this.form.valid) {
      const {name, image, additionalInfo} = this.controls;

      const request: IAddGroupRequest = {
        name: name.value as UniqueName,
        additionalInfo: additionalInfo.value as string
      };

      if (image.value) {
        request.image = { base64: image.value!.base64, filename: image.value!.filename };
      }

      this.onFormSubmit.emit({ request });
    }
  }

  public startCropImage() {
    this._cropImageService.startCrop(
      (base64, filename) => this.controls.image.setValue({base64, filename})
    );
  }

  public get imageUrl() {
    return this.controls.image.value?.base64;
  }

  public get loading(): GroupsStoreLoadingState {
    return this._groupsStore.loading;
  }

  public get controls() {
    return this.form.controls;
  }

  private get _groupsStore(): GroupsStore {
    return this._rootStore.groupsStore;
  }

}
