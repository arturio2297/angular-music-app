import {Component, EventEmitter, Output} from "@angular/core";
import {IGroupResponse, IUpdateGroupRequest} from "../../../../../../models/api/groups.models";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import AdditionalValidators from "../../../../../../validation/control.validators";
import {ImageControlValue} from "../../../../../../models/controls/control.models";
import {BehaviorSubject} from "rxjs";
import {RootStore} from "../../../../../../stores/root.store";
import {GroupsStore} from "../../../../../../stores/groups/groups.store";
import {CropImageService} from "../../../../../../services/crop.image.service";
import {ApiService} from "../../../../../../services/api/api.service";
import { GroupsStoreLoadingState } from "src/app/models/store/groups.store.models";

export type EditGroupFormEvent = { request: IUpdateGroupRequest, image?: File };

@Component({
  selector: 'app-edit-group-form',
  templateUrl: './edit-group-form.component.html',
  styleUrls: ['./edit-group-form.component.less']
})
export class EditGroupFormComponent {

  @Output()
  onFormSubmit = new EventEmitter<EditGroupFormEvent>();

  form = new FormGroup({
    name: new FormControl<UniqueName>(this._group.name, {
      validators: [Validators.required, Validators.maxLength(32)],
      asyncValidators: AdditionalValidators.checkGroupExistsByName(x => this._groupsStore.checkName(x, this._group.id)),
      updateOn: 'blur'
    }),
    additionalInfo: new FormControl<string>(this._group.additionalInfo || ''),
    image: new FormControl<ImageControlValue>(null)
  });

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
      const {name, additionalInfo, image} = this.controls;

      const request: IUpdateGroupRequest = {
        name: name.value as UniqueName,
        additionalInfo: additionalInfo.value as string
      }

      if (image.value) {
        request.image = {base64: image.value!.base64, filename: image.value!.filename};
      }

      this.onFormSubmit.emit({request});
    }
  }

  public startCropImage() {
    this._cropImageService.startCrop(
      (base64, filename) => this.controls.image.setValue({base64, filename})
    );
  }

  public get imageUrl() {
    return this.controls.image.value?.base64 || this._api.groupImageUrl(this._group.id);
  }

  public get loading(): GroupsStoreLoadingState {
    return this._groupsStore.loading;
  }

  public get controls() {
    return this.form.controls;
  }

  private get _group(): IGroupResponse {
    return this._groupsStore.group as IGroupResponse;
  }

  private get _groupsStore(): GroupsStore {
    return this._rootStore.groupsStore;
  }
}
