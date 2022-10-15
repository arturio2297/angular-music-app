import {Component} from "@angular/core";
import {NavigationService} from "../../../../../../services/navigation.service";
import {RootStore} from "../../../../../../stores/root.store";
import {TrackListsStore} from "../../../../../../stores/track-lists/track-lists.store";
import {ITrackListResponse} from "../../../../../../models/api/track-lists.models";

@Component({
  selector: 'app-edit-track-list-header',
  templateUrl: './edit-track-list-header.component.html',
  styleUrls: ['./edit-track-list-header.component.less']
})
export class EditTrackListHeaderComponent {

  constructor(
    private _rootStore: RootStore,
    public navigationService: NavigationService
  ) {
  }

  public get trackList(): ITrackListResponse {
    return this._trackListsStore.trackList as ITrackListResponse;
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }

}
