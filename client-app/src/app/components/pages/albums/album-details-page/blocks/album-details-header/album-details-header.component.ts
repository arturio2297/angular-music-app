import {Component} from "@angular/core";
import {RootStore} from "../../../../../../stores/root.store";
import {NavigationService} from "../../../../../../services/navigation.service";
import {AlbumsStore} from "../../../../../../stores/albums/albums.store";
import {IAlbumResponse} from "../../../../../../models/api/albums.models";
import {IRemoveDialogData} from "../../../../../../models/store/store.models";
import {AccountStore} from "../../../../../../stores/account/account.store";
import {ActionButtonType} from "../../../../../ui/action-button/action-button.component";
import {IDropdownActionItem} from "../../../../../ui/actions-dropdown/actions-dropdown.component";
import {IAddTrackDialogData} from "../../../../../../models/store/tracks.store.models";
import {TracksStore} from "../../../../../../stores/tracks/tracks.store";
import {FormControl, FormGroup} from "@angular/forms";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-album-details-header',
  templateUrl: './album-details-header.component.html',
  styleUrls: ['./album-details-header.component.less']
})
export class AlbumDetailsHeaderComponent {

  actions: IDropdownActionItem[];

  readonly searching$ = new BehaviorSubject(false);

  form = new FormGroup({
    search: new FormControl('')
  });

  constructor(
    private _rootStore: RootStore,
    public navigationService: NavigationService
  ) {
    const {remove, edit} = this.permissions;
    this.actions = [
      { name: 'add', hide: !edit, hint: {content: 'Add new album'} },
      { name: 'update', hide: !edit, hint: {content: 'Edit album'} },
      { name: 'remove', hide: !remove, hint: {content: 'Remove album'} }
    ];
  }

  public onSearchTracks(search: string) {
    this.searching$.next(true);
    this._tracksStore.setFilterField(search, 'search');
    this._tracksStore.clearTracks();
    this._tracksStore.refreshTracks(
      () => this.searching$.next(false),
      () => this.searching$.next(false)
    );
  }

  public onSearchTracksCleared() {
    this.onSearchTracks('');
  }

  public onRemoveQuery(searchQuery: string) {
    this._tracksStore.removeSearchQuery(searchQuery);
  }

  public onActionsClick(type: ActionButtonType) {
    switch (type) {
      case 'add':
        const addData: IAddTrackDialogData = {
          albumName: this.album.name,
          albumId: this.album.id
        };
        this._tracksStore.setDialogField(addData, 'addTrack');
        break;
      case 'update':
        this.navigationService.toEditAlbum(this.album.id);
        break;
      case 'remove':
        const removeData: IRemoveDialogData = {
          name: this.album.name,
          id: this.album.id,
          onSuccess: () => this.navigationService.toAlbums()
        };
        this._albumsStore.setDialogField(removeData, 'deleteAlbum');
        break;
    }
  }

  public showActions(): boolean {
    const {remove, edit} = this.permissions;
    return remove || edit;
  }

  public get permissions() {
    return this._accountStore.permissions.albums;
  }

  public get searchQueries(): string[] {
    return this._tracksStore.searchQueries;
  }

  public get album(): IAlbumResponse {
    return this._albumsStore.album as IAlbumResponse;
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

  private get _tracksStore(): TracksStore {
    return this._rootStore.tracksStore;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }

}
