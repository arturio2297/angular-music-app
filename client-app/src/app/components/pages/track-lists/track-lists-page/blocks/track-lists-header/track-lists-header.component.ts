import {Component} from "@angular/core";
import {IDropdownActionItem} from "../../../../../ui/actions-dropdown/actions-dropdown.component";
import {FormControl, FormGroup} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {RootStore} from "../../../../../../stores/root.store";
import {NavigationService} from "../../../../../../services/navigation.service";
import {TrackListsStore} from "../../../../../../stores/track-lists/track-lists.store";
import {AccountStore} from "../../../../../../stores/account/account.store";
import {ActionButtonType} from "../../../../../ui/action-button/action-button.component";

@Component({
  selector: 'app-track-lists-header',
  templateUrl: './track-lists-header.component.html',
  styleUrls: ['./track-lists-header.component.less']
})
export class TrackListsHeaderComponent {

  actions: IDropdownActionItem[];

  form = new FormGroup({
    search: new FormControl()
  });

  searching$ = new BehaviorSubject(false);

  constructor(
    private _rootStore: RootStore,
    private _navigationService: NavigationService
  ) {
    const {create} = this.permissions;
    this.actions = [
      { name: 'add', hide: !create, hint: { content: 'Add new track list' } }
    ];
  }

  public onSearchCleared() {
    this.onSearch('');
  }

  public onSearch(search: string) {
    this._trackListsStore.setFilterField(search, 'search');
    this.searching$.next(true);
    this._trackListsStore.refreshTrackLists(
      () => this.searching$.next(false),
      () => this.searching$.next(false)
    );
  }

  public onRemoveQuery(searchQuery: string) {
    this._trackListsStore.removeSearchQuery(searchQuery);
  }

  public onActionClick(type: ActionButtonType) {
    switch (type) {
      case "add":
        this._navigationService.toCreateTrackList();
        break;
    }
  }

  public showActions(): boolean {
    const {create} = this.permissions;
    return create;
  }

  public get permissions() {
    return this._accountStore.permissions.trackLists;
  }

  public get searchQueries(): string[] {
    return this._trackListsStore.searchQueries;
  }

  public get filter() {
    return this._trackListsStore.filter;
  }

  public get pagination() {
    return this._trackListsStore.pagination;
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }
}
