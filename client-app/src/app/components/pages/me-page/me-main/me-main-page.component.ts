import {Component, OnInit} from "@angular/core";
import {RootStore} from "../../../../stores/root.store";
import {AlbumsStore} from "../../../../stores/albums/albums.store";
import {TrackListsStore} from "../../../../stores/track-lists/track-lists.store";
import {IAlbumItem} from "../../../../models/api/albums.models";
import {ITrackListItem} from "../../../../models/api/track-lists.models";
import {TrackListType} from "../../../../models/api/track.models";

@Component({
  selector: 'app-me-main-page',
  templateUrl: './me-main-page.component.html',
  styleUrls: ['./me-main-page.component.less']
})
export class MeMainPageComponent implements OnInit {

  readonly albumTracksListType = TrackListType.Album;
  readonly trackListsTracksListType = TrackListType.TrackList;

  constructor(
    private _rootStore: RootStore
  ) {
  }

  public ngOnInit() {
    this._albumsStore.clearAlbumsAndFilters();
    this._albumsStore.setAlbumsForUser(false);
    this._albumsStore.setFilterField(3, 'tracksCount');
    this._albumsStore.refreshAlbums();
    this._trackListsStore.clearTrackListsAndFilter();
    this._trackListsStore.setTrackListsForUser(false);
    this._trackListsStore.setFilterField(3, 'tracksCount');
    this._trackListsStore.refreshTrackLists();
  }

  public get albums(): IAlbumItem[] {
    return this._albumsStore.albums;
  }

  public get trackLists(): ITrackListItem[] {
    return this._trackListsStore.trackLists;
  }

  public get loading(): boolean {
    const {fetchAlbums} = this._albumsStore.loading;
    const {fetchTrackLists} = this._trackListsStore.loading;
    return fetchAlbums || fetchTrackLists;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }


}
