import {Component} from "@angular/core";
import {NavigationService} from "../../../../../../services/navigation.service";
import {RootStore} from "../../../../../../stores/root.store";
import {AlbumsStore} from "../../../../../../stores/albums/albums.store";
import {IAlbumResponse} from "../../../../../../models/api/albums.models";

@Component({
  selector: 'app-edit-album-header',
  templateUrl: './edit-album-header.component.html',
  styleUrls: ['./edit-album-header.component.less']
})
export class EditAlbumHeaderComponent {

  constructor(
    private _rootStore: RootStore,
    public navigationService: NavigationService
  ) {
  }

  public get album(): IAlbumResponse {
    return this._albumsStore.album as IAlbumResponse;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }

}
