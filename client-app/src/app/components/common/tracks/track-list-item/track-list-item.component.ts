import {Component, ElementRef, Input, ViewChild} from "@angular/core";
import {ITrackItem, TrackListType} from "../../../../models/api/track.models";
import {ApiService} from "../../../../services/api/api.service";
import {BehaviorSubject} from "rxjs";
import {RootStore} from "../../../../stores/root.store";
import {PlayerStore} from "../../../../stores/player/player.store";
import {IEditDialogData, IRemoveDialogData} from "../../../../models/store/store.models";
import {ActionButtonType} from "../../../ui/action-button/action-button.component";
import {IDropdownActionItem} from "../../../ui/actions-dropdown/actions-dropdown.component";
import {AccountStore} from "../../../../stores/account/account.store";
import {IPlayerStatuses, IPlayerTime, PlayTrackStatus} from "../../../../models/store/player.store.models";
import {TracksStore} from "../../../../stores/tracks/tracks.store";
import FileUtils from "../../../../utils/files.utils";

export type TrackListItemParams = {
  hideAlbumLink?: boolean,
  hideGroupLink?: boolean,
  likeDisable?: boolean,
  saveDisable?: boolean,
  downloadDisable?: boolean,
  disableActions?: boolean,
  disableControls?: boolean,
  cantPlay?: boolean
};

@Component({
  selector: 'app-track-list-item',
  templateUrl: './track-list-item.component.html',
  styleUrls: ['./track-list-item.component.less']
})
export class TrackListItemComponent {

  actions: IDropdownActionItem[];

  @ViewChild('anchorRef') private _anchorRef: ElementRef<HTMLAnchorElement>;

  readonly isDownload$ = new BehaviorSubject(false);

  @Input()
  track: ITrackItem;

  @Input()
  listId: ID;

  @Input()
  listType: TrackListType;

  @Input()
  params = {} as TrackListItemParams;

  duration$ = new BehaviorSubject<number | null>(null);

  constructor(
    private _rootStore: RootStore,
    private _api: ApiService
  ) {
    const {edit} = this.permissions;
    this.actions = [
      {name: 'update', hide: !edit, hint: { content: 'Edit track' }},
      {name: 'remove', hide: !edit, hint: { content: 'Remove track' }}
    ];
  }

  public onAudioMetadataLoaded(event: any) {
    this.duration$.next(event.target.duration);
  }

  public onPlayerTimeChange(time: number) {
    this._playerStore.rewind(time);
  }

  public onPlayerVolumeChange(volume: number) {
    this._playerStore.setVolume(volume);
  }

  public onActionClick(type: ActionButtonType) {
    switch (type) {
      case "remove":
        const removeData: IRemoveDialogData = {
          id: this.track.id,
          name: this.track.name,
          onSuccess: () => {
            this._playerStore.closePlayer();
          }
        }
        this._tracksStore.setDialogField(removeData, 'deleteTrack');
        break;
      case "update":
        const editData: IEditDialogData<ITrackItem> = {
          item: this.track,
          onSuccess: () => {
            this._playerStore.closePlayer();
          }
        };
        this._tracksStore.setDialogField(editData, 'updateTrack');
        break;
    }
  }

  public get showActions(): boolean {
    const {edit} = this.permissions;
    return edit;
  }

  public onControlsClick() {
    switch (this.itemStatus) {
      case 'none':
        this._playerStore.startPlay(this.listId || this.track.albumId, this.track.id);
        break;
      case 'play':
        this._playerStore.stop();
        break;
      case 'stop':
        this._playerStore.play();
    }
  }

  public onDownloadClick() {
    this.isDownload$.next(true);
    this._tracksStore.fetchFile(this.track.id)
      .subscribe(
        x => {
          const blob = new Blob([x], { type: 'audio/mpeg' })
          FileUtils.readFile(blob)
            .then(base64 => {
              if (base64) {
                const a = this._anchorRef.nativeElement;
                a.download = this.track.filename.substring(33);
                a.href = base64;
                a.click();

                a.download = '';
                a.href = '';
              }
            })
            .finally(() => this.isDownload$.next(false))
        },
        () => this.isDownload$.next(false)
      )
  }

  public get itemStatus(): PlayTrackStatus {
    if (!this.playing) return 'none';
    return this.playerStatuses.play;
  }

  public get playing(): boolean {
    if (!this.playerTrack || this.params.cantPlay) return false;

    return this._playerStore.isTrackPlaying(
      this.listId || this.track.albumId,
      this.listType || TrackListType.Album,
      this.track.id
    );
  }

  public get audioUrl(): string {
    return this._api.trackAudioUrl(this.track.id);
  }

  public get imageUrl() {
    return {
      album: this._api.albumImageUrl(this.track.albumId)
    };
  }

  public get playerTrack(): ITrackItem | null {
    if (!this._playerStore.tracks) return null;
    return this._playerStore.tracks.current;
  }

  public get playerTime(): IPlayerTime {
    return this._playerStore.time;
  }

  public get playerVolume(): number {
    return this._playerStore.volume;
  }

  public get playerStatuses(): IPlayerStatuses {
    return this._playerStore.statuses;
  }

  public get permissions() {
    return this._accountStore.permissions.albums;
  }

  private get _playerStore(): PlayerStore {
    return this._rootStore.playerStore;
  }

  private get _tracksStore(): TracksStore {
    return this._rootStore.tracksStore;
  }

  private get _accountStore(): AccountStore {
    return this._rootStore.accountStore;
  }

}
