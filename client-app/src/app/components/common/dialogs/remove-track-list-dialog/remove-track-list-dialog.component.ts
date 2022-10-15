import {Component} from "@angular/core";
import {RootStore} from "../../../../stores/root.store";
import {ToastsService} from "../../../../services/toasts.service";
import {TrackListsStore} from "../../../../stores/track-lists/track-lists.store";
import {IRemoveDialogData} from "../../../../models/store/store.models";

@Component({
  selector: 'app-remove-track-list-dialog',
  templateUrl: './remove-track-list-dialog.component.html',
  styleUrls: ['./remove-track-list-dialog.component.less']
})
export class RemoveTrackListDialogComponent {

  constructor(
    private _rootStore: RootStore,
    private _toastsService: ToastsService
  ) {
  }

  public onCancel() {
    this._trackListsStore.setDialogField(null, 'deleteTrackList');
  }

  public onDelete() {
    this._trackListsStore.deleteTrackList(
      this.trackListData.id,
      () => {
        this._toastsService.push('Track list successfully deleted', 'success');
        this.trackListData.onSuccess && this.trackListData.onSuccess();
        this.onCancel();
      },
      () => {
        this.trackListData.onFail && this.trackListData.onFail();
      }
    );
  }

  public get trackListData(): IRemoveDialogData {
    return this._trackListsStore.dialog.deleteTrackList as IRemoveDialogData;
  }

  public get loading() {
    return this._trackListsStore.loading;
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }

}
