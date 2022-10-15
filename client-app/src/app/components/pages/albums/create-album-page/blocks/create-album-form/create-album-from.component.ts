import {Component, EventEmitter, Output} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import AdditionalValidators from "../../../../../../validation/control.validators";
import {ImageControlValue, MusicGroupControlValue} from "../../../../../../models/controls/control.models";
import {BehaviorSubject} from "rxjs";
import {RootStore} from "../../../../../../stores/root.store";
import {CropImageService} from "../../../../../../services/crop.image.service";
import {IAddAlbumRequest} from "../../../../../../models/api/albums.models";
import {AlbumsStore} from "../../../../../../stores/albums/albums.store";
import {IGroupItem} from "../../../../../../models/api/groups.models";
import {AlbumsStoreLoadingState, IAlbumStoreSearchState} from "src/app/models/store/albums.store.models";

export type CreateAlbumFormEvent = { request: IAddAlbumRequest, image?: File };

@Component({
  selector: 'app-create-album-form',
  templateUrl: './create-album-from.component.html',
  styleUrls: ['./create-album-from.component.less']
})
export class CreateAlbumFromComponent {

  @Output()
  onFormSubmit = new EventEmitter<CreateAlbumFormEvent>();

  form = new FormGroup({
    name: new FormControl<UniqueName>('', {
      validators: [Validators.required, Validators.maxLength(32)],
      asyncValidators: AdditionalValidators.checkAlbumExistsByName(
        (name, groupId) => this._albumsStore.checkName(name, groupId),
        'group'
      ),
      updateOn: 'blur'
    }),
    releasedAt: new FormControl<DateString>('', Validators.required),
    groupName: new FormControl<UniqueName>('', {
      updateOn: 'change'
    }),
    group: new FormControl<MusicGroupControlValue>(null),
    image: new FormControl<ImageControlValue>(null)
  }, {
    validators:
      [
        // AdditionalValidators.imageRequired('image'),
        AdditionalValidators.groupRequired('groupName', 'group')
      ],
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
      const {name, image, releasedAt, group} = this.controls;

      const request: IAddAlbumRequest = {
        name: name.value as UniqueName,
        releasedAt: new Date(releasedAt.value as DateString).toISOString(),
        groupId: group.value!.id
      };

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

  public onGroupSearch(name: UniqueName) {
    this._albumsStore.searchGroups(name);
  }

  public onGroupItemClick(item: IGroupItem) {
    this.controls.group.setValue({
      name: item.name,
      id: item.id
    });
    this.controls.groupName.setValue(item.name);
    this.clearSearchResult();
  }

  public onGroupSearchCleared() {
    this.controls.group.setValue(null);
    this.controls.name.setValue('');
  }

  public clearSearchResult() {
    this._albumsStore.clearSearchResult('groups');
  }

  public get imageUrl() {
    return this.controls.image.value?.base64;
  }

  public get loading(): AlbumsStoreLoadingState {
    return this._albumsStore.loading;
  }

  public get search(): IAlbumStoreSearchState {
    return this._albumsStore.search;
  }

  public get controls() {
    return this.form.controls;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }

}
