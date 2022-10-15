import {Component} from "@angular/core";
import {RootStore} from "../../../../stores/root.store";
import {ToastsService} from "../../../../services/toasts.service";
import {CreateTrackListFormEvent} from "./blocks/create-track-list-form/create-track-list-form.component";
import {TrackListsStore} from "../../../../stores/track-lists/track-lists.store";

@Component({
  selector: 'app-create-track-list-page',
  templateUrl: './create-track-list-page.component.html',
  styleUrls: ['./create-track-list-page.component.less']
})
export class CreateTrackListPageComponent {

  constructor(
    private _rootStore: RootStore,
    private _toastsService: ToastsService
  ) {
  }

  public createTrackList(event: CreateTrackListFormEvent) {
    this._trackListsStore.addTrackList(
      event.request,
      event.image,
      () => this._toastsService.push('Track list successfully created', 'success')
    );
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }

}
