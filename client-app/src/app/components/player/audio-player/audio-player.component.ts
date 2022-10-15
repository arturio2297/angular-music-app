import {Component} from "@angular/core";
import {ApiService} from "../../../services/api/api.service";
import {RootStore} from "../../../stores/root.store";
import {PlayerStore} from "../../../stores/player/player.store";
import {BehaviorSubject} from "rxjs";
import {IPlayerResponse} from "../../../models/api/player.models";

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.less']
})
export class AudioPlayerComponent {

  readonly closed$ = new BehaviorSubject(false);
  readonly equalizerClosed$ = new BehaviorSubject(false);
  readonly showEqualizer$ = new BehaviorSubject(false);
  private _closeEqualizerTimerId: any;
  private readonly _closeDelay = 250;

  constructor(
    private _rootStore: RootStore,
    private _api: ApiService
  ) {
  }

  public closeEqualizer() {
    clearTimeout(this._closeEqualizerTimerId);
    this.equalizerClosed$.next(true);
    this._closeEqualizerTimerId = setTimeout(() => {
      this.showEqualizer$.next(false);
      this.equalizerClosed$.next(false);
    }, this._closeDelay);
  }

  public onTimeChange(time: number) {
    this._playerStore.rewind(time);
  }

  public onVolumeChange(volume: number) {
    this._playerStore.setVolume(volume);
  }

  public onPlayClick() {
    this._playerStore.play();
  }

  public onStopClick() {
    this._playerStore.stop();
  }

  public onNextClick() {
    this._playerStore.playNext();
  }

  public onPreviousClick() {
    this._playerStore.playPrevious();
  }

  public onRepeatClick() {
    this._playerStore.changeRepeat();
  }

  public onEqualizerActionClick() {
    const show = this.showEqualizer$.value;
    show ? this.closeEqualizer() : this.showEqualizer$.next(true);
  }

  public onClose() {
    this.closed$.next(true);
    setTimeout(() => this._playerStore.closePlayer(), this._closeDelay);
  }

  public get imageUrl() {
    return {
      album: this._api.albumImageUrl(this.list.current.albumId)
    };
  }

  public get trackBuffer() {
    return {
      start: `${this._ranges.start / this.time.duration * 100}%`,
      width: `${(this._ranges.end - this._ranges.start) / this.time.duration * 100}%`
    }
  }

  public get time() {
    return this._playerStore.time;
  }

  public get list() {
    return this._playerStore.tracks as IPlayerResponse;
  }

  public get isSingle(): boolean {
    return this._playerStore.isSingle;
  }

  public get volume(): number {
    return this._playerStore.volume;
  }

  public get equalizerEnabled(): boolean {
    return this._playerStore.equalizerEnabled;
  }

  public get equalizerOn(): boolean {
    return this._playerStore.equalizerOn;
  }

  public get statuses() {
    return this._playerStore.statuses;
  }

  public get tracks() {
    return this._playerStore.tracks;
  }

  private get _ranges() {
    return this._playerStore.ranges;
  }

  private get _playerStore(): PlayerStore {
    return this._rootStore.playerStore;
  }

}
