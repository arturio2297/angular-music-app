import {Component} from '@angular/core';
import {CreateAlbumFormEvent} from "./blocks/create-album-form/create-album-from.component";
import {RootStore} from "../../../../stores/root.store";
import {AlbumsStore} from "../../../../stores/albums/albums.store";
import {ToastsService} from "../../../../services/toasts.service";

@Component({
  selector: 'app-create-album-page',
  templateUrl: './create-album-page.component.html',
  styleUrls: ['./create-album-page.component.less']
})
export class CreateAlbumPageComponent {

  constructor(
    private _rootStore: RootStore,
    private _toastsService: ToastsService
  ) {
  }

  public createAlbum(event: CreateAlbumFormEvent) {
    this._albumsStore.addAlbum(
      event.request,
      event.image,
      () => this._toastsService.push('Music album successfully created', 'success')
    );
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }

}
