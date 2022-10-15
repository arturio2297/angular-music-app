import {Component, Input} from "@angular/core";
import {RootStore} from "../../../stores/root.store";
import {AlbumsStore} from "../../../stores/albums/albums.store";
import {TracksStore} from "../../../stores/tracks/tracks.store";
import {TrackListsStore} from "../../../stores/track-lists/track-lists.store";
import {Size} from "../../../models/common/common.models";
import {HintPosition} from "../hint/hint.component";
import {ILikedItem} from "../../../models/store/store.models";

export type LikedItemType = 'track' | 'album' | 'track-list';

export interface ILikeActionParams {
  showLikesCount?: boolean;
  disableHint?: boolean;
  hintPosition?: HintPosition;
}

@Component({
  selector: 'app-like-action',
  templateUrl: './like-action.component.html',
  styleUrls: ['./like-action.component.less']
})
export class LikeActionComponent<T extends { id: ID, liked: boolean, likesCount: number }> {

  @Input()
  params = {} as ILikeActionParams;

  @Input()
  itemType: LikedItemType;

  @Input()
  item: T;

  @Input()
  size: Size<string>;

  @Input()
  innerSize: Size<string>;

  constructor(
    private _rootStore: RootStore
  ) {
  }

  public onLikeClick() {
    switch (this.itemType) {
      case "track":
        if (this._tracksStore.loading.likeTrack) return;
        this._tracksStore.likeTrack(this.item.id);
        break;
      case "album":
        if (this._albumsStore.loading.likeAlbum) return;
        this._albumsStore.likeAlbum(this.item.id);
        break;
      case "track-list":
        if (this._trackListsStore.loading.likeTrackList) return;
        this._trackListsStore.likeTrackList(this.item.id);
        break;
    }
  }

  public get likeData(): ILikedItem {
    let item: ILikedItem;
    switch (this.itemType) {
      case "album":
        item = this._albumsStore.likedAlbums[this.item.id];
        break;
      case "track":
        item = this._tracksStore.likedTracks[this.item.id];
        break;
      case "track-list":
        item = this._trackListsStore.likedTrackLists[this.item.id];
        break;
    }
    return item || this.item;
  }

  private get _tracksStore(): TracksStore {
    return this._rootStore.tracksStore;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }

}
