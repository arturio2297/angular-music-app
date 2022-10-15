import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {RootStore} from "../../../../../../stores/root.store";
import {NavigationService} from "../../../../../../services/navigation.service";
import {GroupsStore} from "../../../../../../stores/groups/groups.store";
import {BehaviorSubject} from "rxjs";
import {AccountStore} from "../../../../../../stores/account/account.store";
import {ActionButtonType} from "../../../../../ui/action-button/action-button.component";
import {IDropdownActionItem} from "../../../../../ui/actions-dropdown/actions-dropdown.component";

@Component({
  selector: 'app-groups-header',
  templateUrl: './groups-header.component.html',
  styleUrls: ['./groups-header.component.less']
})
export class SearchGroupsComponent {

  actions: IDropdownActionItem[];

  form = new FormGroup({
    search: new FormControl(this.filter.search)
  });

  searching$ = new BehaviorSubject(false);

  constructor(
    private _rootStore: RootStore,
    private _navigationService: NavigationService
  ) {
    const {create} = this.permissions;
    this.actions = [
      { name: 'add', hide: !create, hint: { content: 'Add group' } }
    ];
  }

  public onSearchGroups(search: string) {
    this._groupsStore.setFilterField(search, 'search');
    this.searching$.next(true);
    this._groupsStore.refreshGroups(
      () => this.searching$.next(false),
      () => this.searching$.next(false)
    );
  }

  public onSearchGroupsCleared() {
    this.onSearchGroups('');
  }

  public onRemoveQuery(searchQuery: string) {
    this._groupsStore.removeSearchQuery(searchQuery);
  }

  public onActionClick(type: ActionButtonType) {
    switch (type) {
      case 'add':
        this._navigationService.toCreateGroup();
        break;
    }
  }

  public get showActions(): boolean {
    const {create} = this.permissions;
    return create;
  }

  public get permissions() {
    return this._accountStore.permissions.groups;
  }

  public get searchQueries(): string[] {
    return this._groupsStore.searchQueries;
  }

  public get filter() {
    return this._groupsStore.filter;
  }

  public get pagination() {
    return this._groupsStore.pagination;
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

  private get _groupsStore(): GroupsStore {
    return this._rootStore.groupsStore;
  }

}
