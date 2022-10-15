import {Component, OnDestroy, OnInit} from '@angular/core';
import {RootStore} from "../../../../stores/root.store";
import {ActivatedRoute} from "@angular/router";
import {NavigationService} from "../../../../services/navigation.service";
import {ApiService} from "../../../../services/api/api.service";
import {Subscription} from "rxjs";
import {TrackListsStore} from "../../../../stores/track-lists/track-lists.store";
import {TracksStore} from "../../../../stores/tracks/tracks.store";
import SubscriptionsUtils from "../../../../utils/subscriptions.utils";
import {ITrackListResponse} from "../../../../models/api/track-lists.models";
import {ITrackItem, TrackListType} from "../../../../models/api/track.models";
import RoutesUtils from "../../../../utils/routes.utils";

type TrackListDetailsPageUrlParams = { id: ID };

@Component({
  selector: 'app-track-list.details.page',
  templateUrl: './track-list-details-page.component.html',
  styleUrls: ['./track-list-details-page.component.less']
})
export class TrackListDetailsPageComponent implements OnInit, OnDestroy {

  readonly listType = TrackListType.TrackList;
  private readonly _subscriptions: Subscription[] = [];

  constructor(
    private _rootStore: RootStore,
    private _route: ActivatedRoute,
    private _navigationService: NavigationService,
    private _api: ApiService
  ) { }

  public ngOnInit() {
    this._trackListsStore.clearTrackList();
    this._tracksStore.clearTracksAndFilters();
    this._tracksStore.setTracksFor('track-list');
    const s1 = RoutesUtils.subscribeToParams<TrackListDetailsPageUrlParams>(
      this._route,
      params => {
        this._trackListsStore.fetchTrackList(
          params.id,
          ({ id }) => {
            this._tracksStore.setFilterField(id, 'trackListId');
            this._tracksStore.fetchTracks({});
          }
        );
      }
    );
    SubscriptionsUtils.subscribe(this._subscriptions, s1);
  }

  public ngOnDestroy() {
    SubscriptionsUtils.unsubscribe(this._subscriptions);
  }

  public onScrollDown() {
    if (this._tracksStore.isLastPage) return;
    this._tracksStore.fetchTracks({ fetchMore: true });
  }

  public get trackList(): ITrackListResponse {
    return this._trackListsStore.trackList as ITrackListResponse;
  }

  public get tracks(): ITrackItem[] {
    return this._tracksStore.tracks;
  }

  public get loading() {
    return {
      trackLists: this._trackListsStore.loading,
      tracks: this._tracksStore.loading
    };
  }

  public get tracksFilter() {
    return this._tracksStore.filter;
  }

  private get _tracksStore(): TracksStore {
    return this._rootStore.tracksStore;
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }

}
