import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {RootStore} from "../../../../stores/root.store";
import {ToastsService} from "../../../../services/toasts.service";
import {NavigationService} from "../../../../services/navigation.service";
import {ActivatedRoute} from "@angular/router";
import {TrackListsStore} from "../../../../stores/track-lists/track-lists.store";
import SubscriptionsUtils from "../../../../utils/subscriptions.utils";
import {ITrackListResponse} from "../../../../models/api/track-lists.models";
import {AccountStore} from "../../../../stores/account/account.store";
import RoutesUtils from "../../../../utils/routes.utils";
import {EditTrackListFormEvent} from "./blocks/edit-track-list-form/edit-track-list-form.component";

type EditTrackListPageUrlParams = { id: ID };

@Component({
  selector: 'app-edit-track-list-page',
  templateUrl: './edit-track-list-page.component.html',
  styleUrls: ['./edit-track-list-page.component.less']
})
export class EditTrackListPageComponent implements OnInit, OnDestroy {

  private readonly _subscriptions: Subscription[] = [];

  constructor(
    private _rootStore: RootStore,
    private _toastsService: ToastsService,
    private _navigationService: NavigationService,
    private _route: ActivatedRoute
  ) {
  }

  public ngOnInit() {
    this._trackListsStore.clearTrackList();
    const s1 = RoutesUtils.subscribeToParams<EditTrackListPageUrlParams>(
      this._route,
      params => {
        this._trackListsStore.fetchTrackList(
          params.id,
          ({ authorId }) => {
            const canEdit = this._accountStore.permissions.trackLists.edit(authorId);
            if (!canEdit) {
              this._toastsService.push('You can edit only own track lists', 'warning');
              this._navigationService.toTrackLists();
            }
          },
          () => this._navigationService.toTrackLists()
        );
      }
    );
    SubscriptionsUtils.subscribe(this._subscriptions, s1);
  }
  public ngOnDestroy() {
    SubscriptionsUtils.unsubscribe(this._subscriptions);
  }

  public updateTrackList(event: EditTrackListFormEvent) {
    this._trackListsStore.updateTrackList(
      (this.trackList as ITrackListResponse).id,
      event.request,
      event.image,
      () => this._toastsService.push('Track list successfully updated', 'success')
    );
  }

  public get trackList(): ITrackListResponse | null {
    return this._trackListsStore.trackList;
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }

}
