import {Component} from '@angular/core';
import {RootStore} from "../../../../stores/root.store";
import {IGroupItem} from "../../../../models/api/groups.models";
import {GroupsStore} from "../../../../stores/groups/groups.store";

@Component({
  selector: 'app-groups.page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.less']
})
export class GroupsPageComponent {

  constructor(
    private _rootStore: RootStore
  ) { }

  public onScrollDown() {
    if (this._groupsStore.isLastPage) return;
    this._groupsStore.fetchGroups({ fetchMore: true });
  }

  public get groups(): IGroupItem[] {
    return this._groupsStore.groups;
  }

  public get loading() {
    return this._groupsStore.loading;
  }

  public get searchQuery() {
    return this._groupsStore.filter.search as string;
  }

  private get _groupsStore(): GroupsStore {
    return this._rootStore.groupsStore;
  }

}
