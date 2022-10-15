import {Component} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {RootStore} from "../../../../../../../stores/root.store";
import {TracksStore} from "../../../../../../../stores/tracks/tracks.store";
import {SearchEvent} from "../../../../../../ui/search-control/search-control.component";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-group-tracks-header',
  templateUrl: './group-tracks-header.component.html',
  styleUrls: ['./group-tracks-header.component.less']
})
export class GroupTracksHeaderComponent {

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
    this._tracksStore.clearTracks();
    this._tracksStore.setFilterField(event.value, 'search');
    this._tracksStore.refreshTracks(
      () => this.searching$.next(false),
      () => this.searching$.next(false)
    );
  }

  public onSearchCleared() {
    this.onSearch({ value: '' });
  }

  public onRemoveQuery(searchQuery: string) {
    this._tracksStore.removeSearchQuery(searchQuery);
  }

  public get searchQueries(): string[] {
    return this._tracksStore.searchQueries;
  }

  private get _tracksStore(): TracksStore {
    return this._rootStore.tracksStore;
  }

}
