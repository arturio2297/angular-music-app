import {Component} from "@angular/core";
import {RootStore} from "../../../../stores/root.store";
import {ToastsService} from "../../../../services/toasts.service";
import {AlbumsStore} from "../../../../stores/albums/albums.store";
import {IRemoveDialogData} from "../../../../models/store/store.models";
import {AlbumsStoreLoadingState} from "../../../../models/store/albums.store.models";

@Component({
  selector: 'app-remove-album-dialog',
  templateUrl: './remove-album-dialog.component.html',
  styleUrls: ['./remove-album-dialog.component.less']
})
export class RemoveAlbumDialogComponent {

  constructor(
    private _rootStore: RootStore,
    private _toastsService: ToastsService
  ) {
  }

  public onCancel() {
    this._albumsStore.setDialogField(null, 'deleteAlbum');
  }

  public onDelete() {
    this._albumsStore.deleteAlbum(
      this.albumData.id,
      () => {
        this._toastsService.push('Album successfully deleted', 'success');
        this.albumData.onSuccess && this.albumData.onSuccess();
        this.onCancel();
      },
      () => {
        this.albumData.onFail && this.albumData.onFail();
      }
    );
  }

  public get albumData(): IRemoveDialogData {
    return this._albumsStore.dialog.deleteAlbum as IRemoveDialogData;
  }

  public get loading(): AlbumsStoreLoadingState {
    return this._albumsStore.loading;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }
}
