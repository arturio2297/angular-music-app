import {Component} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {RootStore} from "../../../../../../stores/root.store";
import {AlbumsStore} from "../../../../../../stores/albums/albums.store";
import {SearchEvent} from "../../../../../ui/search-control/search-control.component";

@Component({
  selector: 'app-me-albums-header',
  templateUrl: './me-albums-header.component.html',
  styleUrls: ['./me-albums-header.component.less']
})
export class MeAlbumsHeaderComponent {

  form = new FormGroup({
    search: new FormControl('')
  });

  readonly searching$ = new BehaviorSubject(false);

  constructor(
    private _rootStore: RootStore
  ) {
  }

  public onSearch(event: SearchEvent) {
    this.searching$.next(true);
    this._albumsStore.setFilterField(event.value, 'search');
    this._albumsStore.clearAlbums();
    this._albumsStore.refreshAlbums(
      () => this.searching$.next(false),
      () => this.searching$.next(false)
    );
  }

  public onSearchCleared() {
    this.onSearch({ value: '' });
  }

  public onRemoveQuery(searchQuery: string) {
    this._albumsStore.removeSearchQuery(searchQuery);
  }

  public get searchQueries(): string[] {
    return this._albumsStore.searchQueries;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }

}
