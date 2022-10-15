import {Component} from "@angular/core";
import {RootStore} from "../../../../../../stores/root.store";
import {NavigationService} from "../../../../../../services/navigation.service";
import {AccountStore} from "../../../../../../stores/account/account.store";
import {FormControl, FormGroup} from "@angular/forms";
import {AlbumsStore} from "../../../../../../stores/albums/albums.store";
import {BehaviorSubject} from "rxjs";
import {IDropdownActionItem} from "../../../../../ui/actions-dropdown/actions-dropdown.component";
import {ActionButtonType} from "../../../../../ui/action-button/action-button.component";

@Component({
  selector: 'app-albums-header',
  templateUrl: './albums-header.component.html',
  styleUrls: ['./albums-header.component.less']
})
export class AlbumsHeaderComponent {

  actions: IDropdownActionItem[];

  form = new FormGroup({
    search: new FormControl(this.filter.search)
  })

  searching$ = new BehaviorSubject(false);

  constructor(
    private _rootStore: RootStore,
    public navigationService: NavigationService
  ) {
    const {create} = this.permissions;
    this.actions = [
      { name: 'add', hide: !create, hint: { content: 'Add new album' } }
    ];
  }

  public onSearchAlbums(search: string) {
    this.searching$.next(true);
    this._albumsStore.setFilterField(search, 'search');
    this._albumsStore.refreshAlbums(
      () => this.searching$.next(false),
      () => this.searching$.next(false)
    );
  }

  public onSearchAlbumsCleared() {
    this.onSearchAlbums('');
  }

  public onRemoveQuery(searchQuery: string) {
    this._albumsStore.removeSearchQuery(searchQuery);
  }

  public onActionClick(type: ActionButtonType) {
    switch (type) {
      case 'add':
        this.navigationService.toCreateAlbum();
        break;
    }
  }

  public get showActions(): boolean {
    const {create} = this.permissions;
    return create;
  }

  public get permissions() {
    return this._accountStore.permissions.albums;
  }

  public get filter() {
    return this._albumsStore.filter;
  }

  public get searchQueries(): string[] {
    return this._albumsStore.searchQueries;
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }

}
