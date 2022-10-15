import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {RootStore} from "../../../../stores/root.store";
import {Subscription} from "rxjs";
import RoutesUtils from "../../../../utils/routes.utils";
import {GroupsStore} from "../../../../stores/groups/groups.store";
import {NavigationService} from "../../../../services/navigation.service";
import {ApiService} from "../../../../services/api/api.service";
import SubscriptionsUtils from "../../../../utils/subscriptions.utils";
import {noOp} from "../../../../models/common/common.models";

type GroupDetailsPageUrlParams = { id: ID };

@Component({
  selector: 'app-group.details.page',
  templateUrl: './group-details-page-component.html',
  styleUrls: ['./group-details-page-component.less']
})
export class GroupDetailsPageComponent implements OnInit, OnDestroy {

  private readonly _subscriptions: Subscription[] = [];

  constructor(
    private _rootStore: RootStore,
    private _route: ActivatedRoute,
    private _navigationService: NavigationService,
    private _api: ApiService
  ) { }

  public ngOnInit() {
    this._groupsStore.clearGroup();
    const s1 = RoutesUtils.subscribeToParams<GroupDetailsPageUrlParams>(
      this._route,
      params => {
        this._groupsStore.fetchGroup(
          params.id,
          noOp,
          () => this._navigationService.toGroups()
        );
      }
    );
    SubscriptionsUtils.subscribe(this._subscriptions, s1);
  }

  public ngOnDestroy() {
    SubscriptionsUtils.unsubscribe(this._subscriptions);
  }

  public get group() {
    return this._groupsStore.group;
  }

  public get loading() {
    return this._groupsStore.loading;
  }

  private get _groupsStore(): GroupsStore {
    return this._rootStore.groupsStore;
  }

}
