import {Component, OnInit} from "@angular/core";
import {RootStore} from "../../../../../stores/root.store";
import {TracksStore} from "../../../../../stores/tracks/tracks.store";
import {GroupsStore} from "../../../../../stores/groups/groups.store";
import {IGroupResponse} from "../../../../../models/api/groups.models";
import {TrackListType} from "../../../../../models/api/track.models";

@Component({
  selector: 'app-group-tracks-page',
  templateUrl: './group-tracks-page.component.html',
  styleUrls: ['./group-tracks-page.component.less']
})
export class GroupTracksPageComponent implements OnInit {

  readonly listType = TrackListType.Group;

  constructor(
    private _rootStore: RootStore
  ) {
  }

  public ngOnInit() {
    const groupId = (this._groupsStore.group as IGroupResponse).id;
    this._tracksStore.clearTracksAndFilters();
    this._tracksStore.setTracksFor('group');
    this._tracksStore.setFilterField(groupId, 'groupId');
    this._tracksStore.refreshTracks();
  }

  public onScrollDown() {
    if (this._tracksStore.isLastPage) return;
    this._tracksStore.fetchTracks({ fetchMore: true });
  }

  public get tracks() {
    return this._tracksStore.tracks;
  }

  public get filter() {
    return this._tracksStore.filter;
  }

  public get loading() {
    return this._tracksStore.loading;
  }

  private get _groupsStore(): GroupsStore {
    return this._rootStore.groupsStore;
  }

  private get _tracksStore(): TracksStore {
    return this._rootStore.tracksStore;
  }

}
