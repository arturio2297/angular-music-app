import {Component} from "@angular/core";
import {IDropdownActionItem} from "../../../../ui/actions-dropdown/actions-dropdown.component";
import {RootStore} from "../../../../../stores/root.store";
import {NavigationService} from "../../../../../services/navigation.service";
import {TrackListsStore} from "../../../../../stores/track-lists/track-lists.store";
import {TracksStore} from "../../../../../stores/tracks/tracks.store";
import {AccountStore} from "../../../../../stores/account/account.store";
import {ITrackListResponse} from "../../../../../models/api/track-lists.models";
import {ActionButtonType} from "../../../../ui/action-button/action-button.component";
import {IRemoveDialogData} from "../../../../../models/store/store.models";
import {FormControl, FormGroup} from "@angular/forms";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-track-list-details-header',
  templateUrl: './track-list-details-header.component.html',
  styleUrls: ['./track-list-details-header.component.less']
})
export class TrackListDetailsHeaderComponent {

  actions: IDropdownActionItem[];

  readonly searching$ = new BehaviorSubject(false);

  form = new FormGroup({
    search: new FormControl('')
  });

  constructor(
    private _rootStore: RootStore,
    public navigationService: NavigationService
  ) {
    const {edit, remove} = this.permissions;
    this.actions = [
      { name: 'update', hide: !edit(this.trackList.authorId), hint: { content: 'Edit track list' } },
      { name: 'remove', hide: !remove(this.trackList.authorId), hint: { content: 'Remove track list' } }
    ];
  }

  public onSearchTracks(search: string) {
    this.searching$.next(true);
    this._tracksStore.setFilterField(search, 'search');
    this._tracksStore.clearTracks();
    this._tracksStore.refreshTracks(
      () => this.searching$.next(false),
      () => this.searching$.next(false)
    );
  }

  public onSearchTracksCleared() {
    this.onSearchTracks('');
  }

  public onRemoveQuery(searchQuery: string) {
    this._tracksStore.removeSearchQuery(searchQuery);
  }

  public onActionsClick(type: ActionButtonType) {
    switch (type) {
      case 'update':
        this.navigationService.toEditTrackList(this.trackList.id);
        break;
      case 'remove':
        const trackListData: IRemoveDialogData = {
          id: this.trackList.id,
          name: this.trackList.name,
          onSuccess: () => this.navigationService.toTrackLists()
        };
        this._trackListsStore.setDialogField(trackListData, 'deleteTrackList');
        break;
    }
  }

  public get showActions(): boolean {
    const {edit, remove} = this.permissions;
    return edit(this.trackList.authorId) || remove(this.trackList.authorId);
  }

  public get trackList(): ITrackListResponse {
    return this._trackListsStore.trackList as ITrackListResponse;
  }

  public get searchQueries(): string[] {
    return this._tracksStore.searchQueries;
  }

  public get permissions() {
    return this._accountStore.permissions.trackLists;
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

  private get _tracksStore(): TracksStore {
    return this._rootStore.tracksStore;
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }

}
