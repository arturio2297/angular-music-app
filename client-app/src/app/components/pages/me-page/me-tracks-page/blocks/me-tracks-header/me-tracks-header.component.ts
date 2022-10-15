import {Component} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {RootStore} from "../../../../../../stores/root.store";
import {BehaviorSubject} from "rxjs";
import {TracksStore} from "../../../../../../stores/tracks/tracks.store";
import {SearchEvent} from "../../../../../ui/search-control/search-control.component";

@Component({
  selector: 'app-me-tracks-header',
  templateUrl: './me-tracks-header.component.html',
  styleUrls: ['./me-tracks-header.component.less']
})
export class MeTracksHeaderComponent {

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
    this._tracksStore.setFilterField(event.value, 'search');
    this._tracksStore.clearTracks();
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
