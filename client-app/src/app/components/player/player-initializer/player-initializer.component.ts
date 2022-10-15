import {AfterViewInit, Component, ElementRef, ViewChild} from "@angular/core";
import {RootStore} from "../../../stores/root.store";
import {PlayerStore} from "../../../stores/player/player.store";
import {ApiService} from "../../../services/api/api.service";

@Component({
  selector: 'app-player-initializer',
  templateUrl: './player-initializer.component.html',
  styleUrls: ['./player-initializer.component.less']
})
export class PlayerInitializerComponent implements AfterViewInit {

  @ViewChild('audioRef') private _audioRef: ElementRef<HTMLAudioElement>;

  constructor(
    private _rootStore: RootStore,
    private _api: ApiService
  ) {
  }

  public ngAfterViewInit() {
    this._playerStore.initPlayer(this._audioRef.nativeElement);
  }

  public onMetadataLoaded(event: any) {
    this._playerStore.onMetadataLoaded(event);
  }

  public onEnded() {
    this._playerStore.onEnded();
  }

  public get audioUrl(): string {
    if (!this._playerStore.tracks) return '';
    return this._api.trackAudioUrl(this._playerStore.tracks.current.id);
  }

  private get _playerStore(): PlayerStore {
    return this._rootStore.playerStore;
  }

}
