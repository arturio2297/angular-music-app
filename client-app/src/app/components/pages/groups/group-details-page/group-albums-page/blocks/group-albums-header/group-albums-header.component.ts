import {Component} from "@angular/core";
import {RootStore} from "../../../../../../../stores/root.store";
import {AlbumsStore} from "../../../../../../../stores/albums/albums.store";
import {FormControl, FormGroup} from "@angular/forms";
import {SearchEvent} from "../../../../../../ui/search-control/search-control.component";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-group-albums-header',
  templateUrl: './group-albums-header.component.html',
  styleUrls: ['./group-albums-header.component.less']
})
export class GroupAlbumsHeaderComponent {

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
    this._albumsStore.clearAlbums();
    this._albumsStore.setFilterField(event.value, 'search');
    this._albumsStore.refreshAlbums(
      () => this.searching$.next(false),
      () => this.searching$.next(false)
    );
  }

  public onSearchCleared() {
    this.onSearch({ value: '' });
  }

  public onRemoveSearchQuery(searchQuery: string) {
    this._albumsStore.removeSearchQuery(searchQuery);
  }

  public get searchQueries(): string[] {
    return this._albumsStore.searchQueries;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }

}
