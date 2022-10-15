import {Component, Input} from "@angular/core";
import {RootStore} from "../../../../stores/root.store";
import {AccountStore} from "../../../../stores/account/account.store";
import {IAlbumItem, IAlbumResponse} from "../../../../models/api/albums.models";
import {ApiService} from "../../../../services/api/api.service";
import {AlbumsStore} from "../../../../stores/albums/albums.store";
import {IRemoveDialogData} from "../../../../models/store/store.models";
import {NavigationService} from "../../../../services/navigation.service";
import {IDropdownActionItem} from "../../../ui/actions-dropdown/actions-dropdown.component";
import {ActionButtonType} from "../../../ui/action-button/action-button.component";
import {PlayerStore} from "../../../../stores/player/player.store";
import {PlayTrackStatus} from "../../../../models/store/player.store.models";
import {TrackListType} from "../../../../models/api/track.models";

export interface IAlbumListItemParams {
  hideGroup?: boolean;
  hideTitle?: boolean;
  disableActions?: boolean;
  likeDisable?: boolean;
  saveDisable?: boolean;
  cantPlay?: boolean;
}

@Component({
  selector: 'app-album-list-item',
  templateUrl: './album-list-item.component.html',
  styleUrls: ['./album-list-item.component.less']
})
export class AlbumListItemComponent {

  actions: IDropdownActionItem[];

  @Input()
  album: IAlbumItem | IAlbumResponse;

  @Input()
  params = {} as IAlbumListItemParams;

  constructor(
    private _rootStore: RootStore,
    private _navigationService: NavigationService,
    private _api: ApiService
  ) {
    const {edit, remove} = this.permissions;
    this.actions = [
      {name: 'update', hide: !edit, hint: { content: 'Edit album' }},
      {name: 'remove', hide: !remove, hint: { content: 'Remove album' }}
    ];
  }

  public onActionsClick(type: ActionButtonType) {
    switch (type) {
      case "update":
        this._navigationService.toEditAlbum(this.album.id);
        break;
      case "remove":
        const albumData: IRemoveDialogData = {id: this.album.id, name: this.album.name};
        this._albumsStore.setDialogField(albumData, 'deleteAlbum');
        break;
    }
  }

  public onPlayClick() {
    this.itemStatus === 'none' ?
      this._playerStore.startPlay(this.album.id)
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

  public get permissions() {
    return this._accountStore.permissions.albums;
  }

  public get itemStatus(): PlayTrackStatus {
    if (!this.playing) return 'none';
    return this._playerStore.statuses.play;
  }

  public get playing(): boolean {
    return this._playerStore.isListPlaying(this.album.id, TrackListType.Album);
  }

  public get imageUrls() {
    return {
      album: this._api.albumImageUrl(this.album.id),
      group: this._api.groupImageUrl(this.album.groupId)
    };
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }

  private get _playerStore(): PlayerStore {
    return this._rootStore.playerStore;
  }

}
