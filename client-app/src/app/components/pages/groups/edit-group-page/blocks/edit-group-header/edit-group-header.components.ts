import {Component, Input} from "@angular/core";
import {IGroupItem, IGroupResponse} from "../../../../../../models/api/groups.models";
import {NavigationService} from "../../../../../../services/navigation.service";
import {RootStore} from "../../../../../../stores/root.store";
import {GroupsStore} from "../../../../../../stores/groups/groups.store";

@Component({
  selector: 'app-edit-group-header',
  templateUrl: './edit-group-header.components.html',
  styleUrls: ['./edit-group-header.components.less']
})
export class EditGroupHeaderComponents {

  constructor(
    private _rootStore: RootStore,
    public navigationService: NavigationService
  ) {
  }

  public get group(): IGroupResponse {
    return this._groupsStore.group as IGroupResponse;
  }

  private get _groupsStore(): GroupsStore {
    return this._rootStore.groupsStore;
  }
}
