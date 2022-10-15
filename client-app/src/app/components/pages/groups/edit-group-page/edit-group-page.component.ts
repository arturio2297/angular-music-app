import {Component, OnDestroy, OnInit} from '@angular/core';
import {RootStore} from "../../../../stores/root.store";
import {ToastsService} from "../../../../services/toasts.service";
import {IGroupResponse} from "../../../../models/api/groups.models";
import {GroupsStore} from "../../../../stores/groups/groups.store";
import {NavigationService} from "../../../../services/navigation.service";
import RoutesUtils from "../../../../utils/routes.utils";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import SubscriptionsUtils from "../../../../utils/subscriptions.utils";
import {noOp} from "../../../../models/common/common.models";
import {EditGroupFormEvent} from "./blocks/edit-group-form/edit-group-form.component";
import {GroupsStoreLoadingState} from "../../../../models/store/groups.store.models";

type EditGroupPageUrlParams = { id: ID };

@Component({
  selector: 'app-edit.group.page',
  templateUrl: './edit-group-page.component.html',
  styleUrls: ['./edit-group-page-component.less']
})
export class EditGroupPageComponent implements OnInit, OnDestroy {

  private readonly _subscriptions: Subscription[] = [];

  constructor(
    private _rootStore: RootStore,
    private _toastsService: ToastsService,
    private _navigationService: NavigationService,
    private _route: ActivatedRoute
  ) {
  }

  public ngOnInit() {
    this._groupsStore.clearGroup();
    const s1 = RoutesUtils.subscribeToParams<EditGroupPageUrlParams>(
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

  public updateGroup(event: EditGroupFormEvent) {
    this._groupsStore.updateGroup(
      (this.group as IGroupResponse).id,
      event.request,
      event.image,
      () => this._toastsService.push('Music group successfully updated', 'success')
    );
  }

  public get loading(): GroupsStoreLoadingState {
    return this._groupsStore.loading;
  }

  public get group(): IGroupResponse | null {
    return this._groupsStore.group;
  }

  private get _groupsStore(): GroupsStore {
    return this._rootStore.groupsStore;
  }

}
