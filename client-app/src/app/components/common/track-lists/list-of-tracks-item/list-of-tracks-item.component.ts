import {Component, Input, OnInit} from "@angular/core";
import {ITrackListItem, ITrackListResponse} from "../../../../models/api/track-lists.models";
import {RootStore} from "../../../../stores/root.store";
import {NavigationService} from "../../../../services/navigation.service";
import {ApiService} from "../../../../services/api/api.service";
import {PlayerStore} from "../../../../stores/player/player.store";
import {TrackListsStore} from "../../../../stores/track-lists/track-lists.store";
import {AccountStore} from "../../../../stores/account/account.store";
import {PlayTrackStatus} from "../../../../models/store/player.store.models";
import {ActionButtonType} from "../../../ui/action-button/action-button.component";
import {IRemoveDialogData} from "../../../../models/store/store.models";
import {IDropdownActionItem} from "../../../ui/actions-dropdown/actions-dropdown.component";
import {TrackListType} from "../../../../models/api/track.models";

export interface IListOfTracksItemParams {
  hideTitle?: boolean;
  disableActions?: boolean;
  cantPlay?: boolean;
  likeDisable?: boolean;
  saveDisable?: boolean;
}

@Component({
  selector: 'app-list-of-tracks-item',
  templateUrl: './list-of-tracks-item.component.html',
  styleUrls: ['./list-of-tracks-item.component.less']
})
export class ListOfTracksItemComponent implements OnInit {

  actions: IDropdownActionItem[] = [];

  @Input()
  trackList: ITrackListItem | ITrackListResponse;

  @Input()
  params = {} as IListOfTracksItemParams;

  constructor(
    private _rootStore: RootStore,
    private _navigationService: NavigationService,
    private _api: ApiService
  ) {
  }

  public ngOnInit() {
    const {edit, remove} = this.permissions;
    this.actions = [
      { name: 'update', hide: !edit(this.trackList.authorId), hint: { content: 'Edit track list' } },
      { name: 'remove', hide: !remove(this.trackList.authorId), hint: { content: 'Remove track list' } }
    ];
  }

  public onActionsClick(type: ActionButtonType) {
    switch (type) {
      case "update":
        this._navigationService.toEditTrackList(this.trackList.id);
        break;
      case "remove":
        const trackListData: IRemoveDialogData = { id: this.trackList.id, name: this.trackList.name };
        this._trackListsStore.setDialogField(trackListData, 'deleteTrackList');
        break;
    }
  }

  public onPlayClick() {
    this.itemStatus === 'none' ?
      this._playerStore.startPlay(this.trackList.id)
      :
      this._playerStore.play();
  }

  public onStopClick() {
    this._playerStore.stop();
  }

  public get showActions(): boolean {
    const {edit, remove} = this.permissions;
    return edit(this.trackList.authorId) || remove(this.trackList.authorId);
  }

  public get permissions() {
    return this._accountStore.permissions.trackLists;
  }

  public get itemStatus(): PlayTrackStatus {
    if (!this.playing) return 'none';
    return this._playerStore.statuses.play;
  }

  public get playing(): boolean {
    return this._playerStore.isListPlaying(this.trackList.id, TrackListType.TrackList);
  }

  public get imageUrl() {
    return this._api.trackListImageUrl(this.trackList.id);
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }

  private get _playerStore(): PlayerStore {
    return this._rootStore.playerStore;
  }
}
