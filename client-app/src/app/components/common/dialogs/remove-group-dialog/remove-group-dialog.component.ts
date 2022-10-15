import {Component} from "@angular/core";
import {RootStore} from "../../../../stores/root.store";
import {GroupsStore} from "../../../../stores/groups/groups.store";
import {IRemoveDialogData} from "../../../../models/store/store.models";
import {ToastsService} from "../../../../services/toasts.service";
import {GroupsStoreLoadingState} from "../../../../models/store/groups.store.models";

@Component({
  selector: 'app-remove-group-dialog',
  templateUrl: './remove-group-dialog.component.html',
  styleUrls: ['./remove-group-dialog.component.less']
})
export class RemoveGroupDialogComponent {

  constructor(
    private _rootStore: RootStore,
    private _toastsService: ToastsService
  ) {
  }

  public onCancel() {
    this._groupsStore.setDialogField(null, 'deleteGroup');
  }

  public onDelete() {
    this._groupsStore.deleteGroup(
      this.groupData.id,
      () => {
        this._toastsService.push('Group successfully deleted', 'success');
        this.groupData.onSuccess && this.groupData.onSuccess();
        this.onCancel();
      },
      () => {
        this.groupData.onFail && this.groupData.onFail();
      }
    );
  }

  public get groupData(): IRemoveDialogData {
    return this._groupsStore.dialog.deleteGroup as IRemoveDialogData;
  }

  public get loading(): GroupsStoreLoadingState {
    return this._groupsStore.loading;
  }

  private get _groupsStore(): GroupsStore {
    return this._rootStore.groupsStore;
  }

}
