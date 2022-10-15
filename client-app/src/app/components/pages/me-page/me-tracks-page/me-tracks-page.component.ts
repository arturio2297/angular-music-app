import {Component, OnInit} from "@angular/core";
import {RootStore} from "../../../../stores/root.store";
import {TracksStore} from "../../../../stores/tracks/tracks.store";
import {TrackListType} from "../../../../models/api/track.models";

@Component({
  selector: 'app-me-tracks-page',
  templateUrl: './me-tracks-page.component.html',
  styleUrls: ['./me-tracks-page.component.less']
})
export class MeTracksPageComponent implements OnInit {

  readonly listType = TrackListType.TrackList;

  constructor(
    private _rootStore: RootStore
  ) {
  }

  public ngOnInit() {
    this._tracksStore.clearTracksAndFilters();
    this._tracksStore.setTracksFor('user');
    this._tracksStore.refreshTracks();
  }

  public onScrollDown() {
    if (this._tracksStore.isLastPage) return;
    this._tracksStore.fetchTracks({ fetchMore: true });
  }

  public get filter() {
    return this._tracksStore.filter;
  }

  public get loading() {
    return this._tracksStore.loading;
  }

  public get tracks() {
    return this._tracksStore.tracks;
  }

  private get _tracksStore(): TracksStore {
    return this._rootStore.tracksStore;
  }

}
