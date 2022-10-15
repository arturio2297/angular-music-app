import {Component} from "@angular/core";
import {RootStore} from "../../../../../../stores/root.store";
import {FormControl, FormGroup} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {TrackListsStore} from "../../../../../../stores/track-lists/track-lists.store";
import {SearchEvent} from "../../../../../ui/search-control/search-control.component";

@Component({
  selector: 'app-me-track-lists-header',
  templateUrl: './me-track-lists-header.component.html',
  styleUrls: ['./me-track-lists-header.component.less']
})
export class MeTrackListsHeaderComponent {

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
    this._trackListsStore.clearTrackList();
    this._trackListsStore.setFilterField(event.value, 'search');
    this._trackListsStore.refreshTrackLists(
      () => this.searching$.next(false),
      () => this.searching$.next(false)
    );
  }

  public onSearchCleared() {
    this.onSearch({ value: '' });
  }

  public onRemoveQuery(searchQuery: string) {
    this._trackListsStore.removeSearchQuery(searchQuery);
  }

  public get searchQueries(): string[] {
    return this._trackListsStore.searchQueries;
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }

}
