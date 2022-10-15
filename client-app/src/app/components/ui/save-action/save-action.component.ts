import {Component, Input} from "@angular/core";
import {RootStore} from "../../../stores/root.store";
import {AlbumsStore} from "../../../stores/albums/albums.store";
import {TracksStore} from "../../../stores/tracks/tracks.store";
import {TrackListsStore} from "../../../stores/track-lists/track-lists.store";
import {Size} from "../../../models/common/common.models";
import {HintPosition} from "../hint/hint.component";
import {ISavedItem} from "../../../models/store/store.models";

export type SavedItemType = 'track' | 'album' | 'track-list';

export interface ISaveActionParams {
  disableHint?: boolean;
  hintPosition?: HintPosition;
}

@Component({
  selector: 'app-save-action',
  templateUrl: './save-action.component.html',
  styleUrls: ['./save-action.component.less']
})
export class SaveActionComponent<T extends { id: ID, saved: boolean }> {

  @Input()
  params = {} as ISaveActionParams;

  @Input()
  itemType: SavedItemType;

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

  public onSaveClick() {
    switch (this.itemType) {
      case "track":
        if (this._trackStore.loading.saveTrack) return;
        this._trackStore.saveTrack(this.item.id);
        break;
      case "album":
        if (this._albumsStore.loading.saveAlbum) return;
        this._albumsStore.saveAlbum(this.item.id);
        break;
      case "track-list":
        if (this._trackListsStore.loading.saveTrackList) return;
        this._trackListsStore.saveTrackList(this.item.id);
        break;
    }
  }

  private get _trackStore(): TracksStore {
    return this._rootStore.tracksStore;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }

  public get saveData(): ISavedItem {
    let item: ISavedItem;
    switch (this.itemType) {
      case "album":
        item = this._albumsStore.savedAlbums[this.item.id];
        break;
      case "track":
        item = this._trackStore.savedTracks[this.item.id];
        break;
      case "track-list":
        item = this._trackListsStore.savedTrackLists[this.item.id];
        break;
    }
    return item || this.item;
  }

}
