import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {RootStore} from "../../../../stores/root.store";
import {ActivatedRoute} from "@angular/router";
import {NavigationService} from "../../../../services/navigation.service";
import RoutesUtils from "../../../../utils/routes.utils";
import {AlbumsStore} from "../../../../stores/albums/albums.store";
import SubscriptionsUtils from "../../../../utils/subscriptions.utils";
import {IAlbumResponse} from "../../../../models/api/albums.models";
import {ApiService} from "../../../../services/api/api.service";
import {ITrackItem, TrackListType} from "../../../../models/api/track.models";
import {TracksStore} from "../../../../stores/tracks/tracks.store";

type AlbumDetailsPageUrlParams = { id: ID };

@Component({
  selector: 'app-album.details.page',
  templateUrl: './album-details-page.component.html',
  styleUrls: ['./album-details-page.component.less']
})
export class AlbumDetailsPageComponent implements OnInit, OnDestroy {

  readonly listType = TrackListType.Album;
  private readonly _subscriptions: Subscription[] = [];

  constructor(
    private _rootStore: RootStore,
    private _route: ActivatedRoute,
    private _navigationService: NavigationService,
    private _api: ApiService
  ) { }

  public ngOnInit() {
    this._albumsStore.clearAlbum();
    this._tracksStore.clearTracksAndFilters();
    this._tracksStore.setTracksFor('album');
    const s1 = RoutesUtils.subscribeToParams<AlbumDetailsPageUrlParams>(
      this._route,
      params => {
        this._albumsStore.fetchAlbum(
          params.id,
          ({ id }) => {
            this._tracksStore.setFilterField(id, 'albumId');
            this._tracksStore.fetchTracks({});
          },
          () => this._navigationService.toAlbums()
        )
      }
    );
    SubscriptionsUtils.subscribe(this._subscriptions, s1);
  }

  public ngOnDestroy() {
    SubscriptionsUtils.unsubscribe(this._subscriptions);
  }

  public get album(): IAlbumResponse {
    return this._albumsStore.album as IAlbumResponse;
  }

  public get tracks(): ITrackItem[] {
    return this._tracksStore.tracks;
  }

  public get loading() {
    return {
      albums: this._albumsStore.loading,
      tracks: this._tracksStore.loading
    };
  }

  public get tracksFilter() {
    return this._tracksStore.filter;
  }

  private get _tracksStore(): TracksStore {
    return this._rootStore.tracksStore;
  }

  private get _albumsStore(): AlbumsStore {
    return this._rootStore.albumsStore;
  }

}
