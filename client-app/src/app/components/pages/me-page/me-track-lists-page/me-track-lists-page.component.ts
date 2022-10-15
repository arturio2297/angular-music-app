import {Component, OnInit} from "@angular/core";
import {RootStore} from "../../../../stores/root.store";
import {TrackListsStore} from "../../../../stores/track-lists/track-lists.store";

@Component({
  selector: 'app-me-track-lists-page',
  templateUrl: './me-track-lists-page.component.html',
  styleUrls: ['./me-track-lists-page.component.less']
})
export class MeTrackListsPageComponent implements OnInit {

  constructor(
    private _rootStore: RootStore
  ) {
  }

  public ngOnInit() {
    this._trackListsStore.clearTrackListsAndFilter();
    this._trackListsStore.setTrackListsForUser(true);
    this._trackListsStore.refreshTrackLists();
  }

  public onScrollDown() {
    if (this._trackListsStore.isLastPage) return;
    this._trackListsStore.fetchTrackLists({ fetchMore: true });
  }

  public get searchQuery() {
    return this._trackListsStore.filter.search as string;
  }

  public get loading() {
    return this._trackListsStore.loading;
  }

  public get trackLists() {
    return this._trackListsStore.trackLists;
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }

}
