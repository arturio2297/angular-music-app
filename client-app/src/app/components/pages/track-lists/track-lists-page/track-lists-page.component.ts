import {Component, OnDestroy, OnInit} from '@angular/core';
import {RootStore} from "../../../../stores/root.store";
import {TrackListsStore} from "../../../../stores/track-lists/track-lists.store";
import {ITrackListItem} from "../../../../models/api/track-lists.models";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import SubscriptionsUtils from "../../../../utils/subscriptions.utils";
import RoutesUtils from "../../../../utils/routes.utils";

interface ITrackListsPageQueryParams {
  author: UniqueName;
}

@Component({
  selector: 'app-track-lists.page',
  templateUrl: './track-lists-page.component.html',
  styleUrls: ['./track-lists-page.component.less']
})
export class TrackListsPageComponent implements OnInit, OnDestroy {

  private readonly _subscriptions: Subscription[] = [];

  constructor(
    private _rootStore: RootStore,
    private _route: ActivatedRoute
  ) { }

  public ngOnInit() {
    RoutesUtils.subscribeToParams<ITrackListsPageQueryParams>(
      this._route,
      ({ author }) => {
        this._trackListsStore.clearTrackListsAndFilter();
        author && this._trackListsStore.setFilterField(author, 'author');
        this._trackListsStore.setTrackListsForUser(false);
        this._trackListsStore.fetchTrackLists({});
        },
      true
    );
  }

  public ngOnDestroy() {
    SubscriptionsUtils.unsubscribe(this._subscriptions);
  }

  public onScrollDown() {
    if (this._trackListsStore.isLastPage) return;
    this._trackListsStore.fetchTrackLists({ fetchMore: true });
  }

  public get trackLists(): ITrackListItem[] {
    return this._trackListsStore.trackLists;
  }

  public get searchQuery() {
    return this._trackListsStore.filter.search as string;
  }

  public get loading() {
    return this._trackListsStore.loading;
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }
}
