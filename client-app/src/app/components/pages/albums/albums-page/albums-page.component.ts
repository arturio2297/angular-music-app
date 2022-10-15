import {Component, OnInit} from '@angular/core';
import {RootStore} from "../../../../stores/root.store";
import {AlbumsStore} from "../../../../stores/albums/albums.store";
import {IAlbumItem} from "../../../../models/api/albums.models";

@Component({
  selector: 'app-albums.page',
  templateUrl: './albums-page.component.html',
  styleUrls: ['./albums-page.component.less']
})
export class AlbumsPageComponent implements OnInit {

  constructor(
    private _rootStore: RootStore
  ) { }

  public ngOnInit() {
    this._albumsStore.setAlbumsForUser(false);
    this._albumsStore.clearAlbumsAndFilters();
    this._albumsStore.fetchAlbums({});
  }

  public onScrollDown() {
    if (this._albumsStore.isLastPage) return;
    this._albumsStore.fetchAlbums({fetchMore: true});
  }

  public get albums(): IAlbumItem[] {
    return this._albumsStore.albums;
  }

  public get loading() {
    return this._albumsStore.loading;
  }

  public get searchQuery() {
    return this._albumsStore.filter.search as string;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }

}
