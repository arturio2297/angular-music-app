import {Component, OnInit} from "@angular/core";
import {RootStore} from "../../../../stores/root.store";
import {AlbumsStore} from "../../../../stores/albums/albums.store";

@Component({
  selector: 'app-me-albums-page',
  templateUrl: './me-albums-page.component.html',
  styleUrls: ['./me-albums-page.component.less']
})
export class MeAlbumsPageComponent implements OnInit {

  constructor(
    private _rootStore: RootStore
  ) {
  }

  public ngOnInit() {
    this._albumsStore.clearAlbumsAndFilters();
    this._albumsStore.setAlbumsForUser(true);
    this._albumsStore.refreshAlbums();
  }

  public onScrollDown() {
    if (this._albumsStore.isLastPage) return;
    this._albumsStore.fetchAlbums({ fetchMore: true })
  }

  public get searchQuery() {
    return this._albumsStore.filter.search as string;
  }

  public get loading() {
    return this._albumsStore.loading;
  }

  public get albums() {
    return this._albumsStore.albums;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }

}
