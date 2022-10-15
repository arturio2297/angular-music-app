import {Component, Input} from '@angular/core';
import {IGroupItem, IGroupResponse} from "../../../../models/api/groups.models";
import {RootStore} from "../../../../stores/root.store";
import {AccountStore} from "../../../../stores/account/account.store";
import {GroupsStore} from "../../../../stores/groups/groups.store";
import {IRemoveDialogData} from "../../../../models/store/store.models";
import {NavigationService} from "../../../../services/navigation.service";
import {ApiService} from "../../../../services/api/api.service";
import {IDropdownActionItem} from "../../../ui/actions-dropdown/actions-dropdown.component";
import {ActionButtonType} from "../../../ui/action-button/action-button.component";
import {PlayerStore} from "../../../../stores/player/player.store";
import {PlayTrackStatus} from "../../../../models/store/player.store.models";
import {TrackListType} from "../../../../models/api/track.models";

export interface IGroupItemParams {
  hideTitle?: boolean;
  cantPlay?: boolean;
  disableActions?: boolean;
}

@Component({
  selector: 'app-group-list-item',
  templateUrl: './group.list.item.component.html',
  styleUrls: ['./group.list.item.component.less']
})
export class GroupListItemComponent {

  actions: IDropdownActionItem[];

  @Input()
  params = {} as IGroupItemParams;

  @Input()
  group: IGroupItem | IGroupResponse;

  constructor(
    private _rootStore: RootStore,
    private _navigationService: NavigationService,
    private _api: ApiService
  ) {
    const {edit, remove} = this.permissions;
    this.actions = [
      { name: 'update', hide: !edit, hint: { content: 'Edit group' } },
      { name: 'remove', hide: !remove, hint: { content: 'Remove group' } }
    ];
  }

  public onActionsClick(type: ActionButtonType) {
    switch (type) {
      case "update":
        this._navigationService.toEditGroup(this.group.id);
        break;
      case "remove":
        const removeData: IRemoveDialogData = { id: this.group.id, name: this.group.name };
        this._groupsStore.setDialogField(removeData, 'deleteGroup');
        break;
    }
  }

  public onPlayClick() {
    this.itemStatus === 'none' ?
      this._playerStore.startPlay(this.group.id)
      :
      this._playerStore.play();
  }

  public onStopClick() {
    this._playerStore.stop();
  }

  public get showActions(): boolean {
    const {edit, remove} = this.permissions;
    return edit || remove;
  }

  public get imageUrl() {
    return this._api.groupImageUrl(this.group.id);
  }

  public get permissions() {
    return this._accountStore.permissions.groups;
  }

  public get itemStatus(): PlayTrackStatus {
    if (!this.playing) return 'none';
    return this._playerStore.statuses.play;
  }

  public get isSingle(): boolean {
    return this._playerStore.isSingle;
  }

  public get playing(): boolean {
    return this._playerStore.isListPlaying(this.group.id, TrackListType.Group);
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

  private get _groupsStore(): GroupsStore {
    return this._rootStore.groupsStore;
  }

  private get _playerStore(): PlayerStore {
    return this._rootStore.playerStore;
  }

}
