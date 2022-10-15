import {Component, EventEmitter, Output} from "@angular/core";
import {IAlbumResponse, IUpdateAlbumRequest} from "../../../../../../models/api/albums.models";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import AdditionalValidators from "../../../../../../validation/control.validators";
import {IGroupItem} from "../../../../../../models/api/groups.models";
import {ImageControlValue, MusicGroupControlValue} from "../../../../../../models/controls/control.models";
import {BehaviorSubject} from "rxjs";
import {RootStore} from "../../../../../../stores/root.store";
import {CropImageService} from "../../../../../../services/crop.image.service";
import {AlbumsStore} from "../../../../../../stores/albums/albums.store";
import {ApiService} from "../../../../../../services/api/api.service";
import DateUtils from "../../../../../../utils/date.utils";
import {AlbumsStoreLoadingState, IAlbumStoreSearchState} from "src/app/models/store/albums.store.models";

export type EditAlbumFormEvent = { request: IUpdateAlbumRequest, image?: File };

@Component({
  selector: 'app-edit-album-form',
  templateUrl: './edit-album-form.component.html',
  styleUrls: ['./edit-album-form.component.less']
})
export class EditAlbumFormComponent {

  @Output()
  onFormSubmit = new EventEmitter<EditAlbumFormEvent>();

  form = new FormGroup({
    name: new FormControl<UniqueName>(this._album.name, {
      validators: [Validators.required, Validators.maxLength(32)],
      asyncValidators: AdditionalValidators.checkAlbumExistsByName(
        (name, groupId) => this._albumsStore.checkName(name, groupId, this._album.id),
        'group'
      ),
      updateOn: 'blur'
    }),
    releasedAt: new FormControl<DateString>(DateUtils.toInputDate(this._album.releasedAt), Validators.required),
    groupName: new FormControl<UniqueName>(this._album.groupName, {
      updateOn: 'change'
    }),
    group: new FormControl<MusicGroupControlValue>({ name: this._album.groupName, id: this._album.groupId }),
    image: new FormControl<ImageControlValue>(null)
  }, {
    validators:
      [
        AdditionalValidators.groupRequired('groupName', 'group')
      ],
    updateOn: 'submit'
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
      const {name, image, releasedAt, group} = this.controls;

      const request: IUpdateAlbumRequest = {
        name: name.value as UniqueName,
        releasedAt: new Date(releasedAt.value as DateString).toISOString(),
        groupId: (group.value as IGroupItem).id
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

  public onGroupCleared() {
    this.controls.group.setValue(null);
  }

  public clearSearchResult() {
    this._albumsStore.clearSearchResult('groups');
  }

  public get imageUrl() {
    return this.controls.image.value?.base64 || this._api.albumImageUrl(this._album.id);
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

  private get _album(): IAlbumResponse {
    return this._albumsStore.album as IAlbumResponse;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }
}
