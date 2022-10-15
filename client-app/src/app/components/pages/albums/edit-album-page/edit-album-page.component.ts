import {Component, OnDestroy, OnInit} from "@angular/core";
import {RootStore} from "../../../../stores/root.store";
import {EditAlbumFormEvent} from "./blocks/edit-album-form/edit-album-form.component";
import {AlbumsStore} from "../../../../stores/albums/albums.store";
import {ToastsService} from "../../../../services/toasts.service";
import RoutesUtils from "../../../../utils/routes.utils";
import {NavigationService} from "../../../../services/navigation.service";
import {ActivatedRoute} from "@angular/router";
import {noOp} from "../../../../models/common/common.models";
import SubscriptionsUtils from "../../../../utils/subscriptions.utils";
import {Subscription} from "rxjs";
import {IAlbumResponse} from "../../../../models/api/albums.models";
import {AlbumsStoreLoadingState} from "../../../../models/store/albums.store.models";

type EditAlbumPageUrlParams = { id: ID };

@Component({
  selector: 'app-edit-album-page',
  templateUrl: './edit-album-page.component.html',
  styleUrls: ['./edit-album-page.component.less']
})
export class EditAlbumPageComponent implements OnInit, OnDestroy {

  private readonly _subscriptions: Subscription[] = [];

  constructor(
    private _rootStore: RootStore,
    private _toastsService: ToastsService,
    private _navigationService: NavigationService,
    private _route: ActivatedRoute
  ) {
  }

  public ngOnInit() {
    this._albumsStore.clearAlbum();
    const s1 = RoutesUtils.subscribeToParams<EditAlbumPageUrlParams>(
      this._route,
      params => {
        this._albumsStore.fetchAlbum(
          params.id,
          noOp,
          () => this._navigationService.toAlbums()
        );
      }
    )
    SubscriptionsUtils.subscribe(this._subscriptions, s1);
  }

  public ngOnDestroy() {
    SubscriptionsUtils.unsubscribe(this._subscriptions);
  }

  public updateAlbum(event: EditAlbumFormEvent) {
    this._albumsStore.updateAlbum(
      (this.album as IAlbumResponse).id,
      event.request,
      event.image,
      () => this._toastsService.push('Music album successfully updated', 'success')
    );
  }

  public get album(): IAlbumResponse | null {
    return this._albumsStore.album;
  }

  public get loading(): AlbumsStoreLoadingState {
    return this._albumsStore.loading;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }
}
