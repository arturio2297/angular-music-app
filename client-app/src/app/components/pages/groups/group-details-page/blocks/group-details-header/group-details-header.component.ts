import {Component, Input} from "@angular/core";
import {RootStore} from "../../../../../../stores/root.store";
import {NavigationService} from "../../../../../../services/navigation.service";
import {ActionButtonType} from "../../../../../ui/action-button/action-button.component";
import {GroupsStore} from "../../../../../../stores/groups/groups.store";
import {AccountStore} from "../../../../../../stores/account/account.store";
import {IGroupResponse} from "../../../../../../models/api/groups.models";
import {IRemoveDialogData} from "../../../../../../models/store/store.models";
import {IDropdownActionItem} from "../../../../../ui/actions-dropdown/actions-dropdown.component";
import {FormControl, FormGroup} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import applicationUrls from "../../../../../../models/navigation/navigation.models";

const urls = Object.values(applicationUrls).filter(x => x.parentValue === applicationUrls.groupDetails.value);

@Component({
  selector: 'app-group-details-header',
  templateUrl: './group-details-header.component.html',
  styleUrls: ['./group-details-header.component.less']
})
export class GroupDetailsHeaderComponent {

  @Input()
  contentSwitching: boolean;

  urls = urls;

  actions: IDropdownActionItem[];

  readonly searching$ = new BehaviorSubject(false);

  form = new FormGroup({
    search: new FormControl('')
  });

  constructor(
    private _rootStore: RootStore,
    public navigationService: NavigationService
  ) {
    const {edit, remove} = this.permissions.groups;
    const {create} = this.permissions.albums;
    this.actions = [
      { name: 'add', hide: !create, hint: { content: 'Add new album' } },
      { name: 'update', hide: !edit, hint: { content: 'Edit group' } },
      { name: 'remove', hide: !remove, hint: { content: 'Remove group' } }
    ];
  }

  public onActionsClick(type: ActionButtonType) {
    switch (type) {
      case 'add':
        this.navigationService.toCreateAlbum();
        break;
      case 'update':
        this.navigationService.toEditGroup(this.group.id);
        break;
      case 'remove':
        const removeData: IRemoveDialogData = {
          name: this.group.name,
          id: this.group.id,
          onSuccess: () => this.navigationService.toGroups()
        };
        this._groupsStore.setDialogField(removeData, 'deleteGroup');
        break;
    }
  }

  public get showActions() {
    const {edit, remove} = this.permissions.groups;
    const {create} = this.permissions.albums;
    return create || edit || remove;
  }

  public get permissions() {
    return {
      groups: this._accountStore.permissions.groups,
      albums: this._accountStore.permissions.albums
    }
  }

  public get group(): IGroupResponse {
    return this._groupsStore.group as IGroupResponse;
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

  private get _groupsStore(): GroupsStore {
    return this._rootStore.groupsStore;
  }

}
