import {Component, OnInit} from "@angular/core";
import {RootStore} from "../../../../../stores/root.store";
import {GroupsStore} from "../../../../../stores/groups/groups.store";
import {AlbumsStore} from "../../../../../stores/albums/albums.store";
import {IGroupResponse} from "../../../../../models/api/groups.models";

@Component({
  selector: 'app-group-albums-page',
  templateUrl: './group-albums-page.component.html',
  styleUrls: ['./group-albums-page.component.less']
})
export class GroupAlbumsPageComponent implements OnInit {

  constructor(
    private _rootStore: RootStore
  ) {
  }

  public ngOnInit() {
    const groupId = (this._groupsStore.group as IGroupResponse).id;
    this._albumsStore.clearAlbumsAndFilters();
    this._albumsStore.setAlbumsForUser(false);
    this._albumsStore.setFilterField(groupId, 'groupId');
    this._albumsStore.refreshAlbums();
  }

  public onScrollDown() {
    if (this._albumsStore.isLastPage) return;
    this._albumsStore.fetchAlbums({ fetchMore: true });
  }

  public get albums() {
    return this._albumsStore.albums;
  }

  public get searchQuery() {
    return this._albumsStore.filter.search as string;
  }

  public get loading() {
    return this._albumsStore.loading;
  }

  private get _groupsStore(): GroupsStore {
    return this._rootStore.groupsStore;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }

}
