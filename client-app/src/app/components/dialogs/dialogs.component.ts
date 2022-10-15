import {Component} from "@angular/core";
import {RootStore} from "../../stores/root.store";

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html'
})
export class DialogsComponent {

  constructor(private _rootStore: RootStore) {
  }

  public get dialogs() {
    return {
      account: this._rootStore.accountStore.dialog,
      groups: this._rootStore.groupsStore.dialog,
      albums: this._rootStore.albumsStore.dialog,
      tracks: this._rootStore.tracksStore.dialog,
      trackLists: this._rootStore.trackListsStore.dialog
    };
  }

}
