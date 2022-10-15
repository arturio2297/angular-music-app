import {Component} from "@angular/core";
import {RootStore} from "../../../../stores/root.store";
import {ToastsService} from "../../../../services/toasts.service";
import {IRemoveDialogData} from "../../../../models/store/store.models";
import {TracksStore} from "../../../../stores/tracks/tracks.store";

@Component({
  selector: 'app-remove-track-dialog',
  templateUrl: './remove-track-dialog.component.html',
  styleUrls: ['./remove-track-dialog.component.less']
})
export class RemoveTrackDialogComponent {

  constructor(
    private _rootStore: RootStore,
    private _toastsService: ToastsService
  ) {
  }

  public onCancel() {
    this._tracksStore.setDialogField(null, 'deleteTrack');
  }

  public onDelete() {
    this._tracksStore.deleteTrack(
      this.trackData.id,
      () => {
        this._toastsService.push('Track successfully deleted', 'success');
        this.trackData.onSuccess && this.trackData.onSuccess();
        this.onCancel();
      },
      () => {
        this.trackData.onFail && this.trackData.onFail();
      }
    )
  }

  public get trackData(): IRemoveDialogData {
    return this._tracksStore.dialog.deleteTrack as IRemoveDialogData;
  }

  public get loading() {
    return this._tracksStore.loading;
  }

  private get _tracksStore(): TracksStore {
    return this._rootStore.tracksStore;
  }

}
