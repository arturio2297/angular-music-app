import {
  ChangeState,
  IStore
} from "../../models/store/store.models";
import {BehaviorSubject, finalize, Observable} from "rxjs";
import {ApiService} from "../../services/api/api.service";
import {NavigationService} from "../../services/navigation.service";
import {
  IAudioPlayerStoreState,
  IPlayerTime,
  RepeatTrackStatus,
  PlayTrackStatus,
  IPlayerStatuses,
  PlayerStoreLoadingField,
  PlayerStoreLoadingState,
  IPlayerListState,
  equalizerFrequencies, IPlayerEqualizerState, EqualizerFrequency, IEqualizerSettings, IPlayerStoreVisualiserState
} from "../../models/store/player.store.models";
import {Action, noOp} from "../../models/common/common.models";
import {IPlayerResponse} from "../../models/api/player.models";
import {PlayerStorageService} from "../../services/storage/player.storage.service";
import {TrackListType} from "../../models/api/track.models";
import {Equalizer} from "./equalizer";

export type OnPlayerTracksFetched = (response: IPlayerResponse) => void;

export type ChangeAudioPlayerState = ChangeState<IAudioPlayerStoreState>;

export type TimeRanges = { start: number, end: number };

export class PlayerStore implements IStore<IAudioPlayerStoreState> {

  readonly state$ = new BehaviorSubject({} as IAudioPlayerStoreState);
  private readonly _ranges$ = new BehaviorSubject<TimeRanges>({ start: 0, end: 0 });
  private readonly _el$ = new BehaviorSubject<HTMLAudioElement | null>(null);
  private readonly _visualiserCanvas$ = new BehaviorSubject<HTMLCanvasElement | null>(null);
  private readonly _equalizerOn$ = new BehaviorSubject(false);
  private _timeIntervalId: any;
  private readonly _timeIntervalDelay = 500;
  private readonly _changeState: ChangeAudioPlayerState;
  private readonly _equaliser = new Equalizer();

  constructor(
    state$: Observable<IAudioPlayerStoreState>,
    changeState: ChangeAudioPlayerState,
    private _api: ApiService,
    private _navigationService: NavigationService,
    private _playerStorage: PlayerStorageService
  ) {
    state$.subscribe(x => this.state$.next(x));
    this._changeState = state => {
      this._playerStorage.set(state);
      changeState(state);
    }
  }

  public init(onSuccess = noOp, onFail = noOp) {
    const state = this._playerStorage.get();
    if (state != null) {
      const play = state.statuses.play;
      this._changeState({...state, statuses: {...state.statuses, play: play === 'play' ? 'stop' : play}});
    }
    this._equaliser.setVisualiserColor(this.visualiserState.color);
  }

  public initPlayer(el: HTMLAudioElement) {
    this._el$.next(el);
  }

  public initVisualiser(visualiserCanvas: HTMLCanvasElement) {
    this._visualiserCanvas$.next(visualiserCanvas);
    this.statuses.play === 'play' && this.startVisualise();
  }

  public destroyVisualizer() {
   this.stopVisualise();
   this._visualiserCanvas$.next(null);
  }

  public turnOnEqualizer(onFail: Action = noOp) {
    this._equaliser.turnOn(equalizerFrequencies, this.currentEqualizerSettings.gains);
    this._equalizerOn$.next(true);
  }

  public turnOffEqualizer() {
    this._equaliser.turnOff();
    this._equalizerOn$.next(false);
  }

  public startVisualise() {
    if (!this._visualiserCanvas) return;

    this._equaliser.startVisualise(this._visualiserCanvas);
    this.equalizerState
  }

  public stopVisualise() {
    this._equaliser.stopVisualise();
  }

  public onMetadataLoaded(event: any) {
    const duration = event.target.duration;
    this._el.volume = this.volume;
    this._el.currentTime = this.time.currentTime;
    this._setTime({...this.time, duration});
    switch (this.statuses.play) {
      case "play":
        this.play();
        break;
      case "stop":
        this.stop();
        break;
    }
  }

  public onEnded() {
    this.stop();

    switch (this.statuses.repeat) {
      case "none":
        this.tracks.isLast ?
          this._prepareFirst()
          :
          this.playNext()
        break;
      case "track":
        this.repeatTrack();
        break;
      case "track-list":
        this.isSingle ?
          this.repeatTrack()
          :
          this.playNext();
        break;
    }
  }

  public play() {
    this._el.play()
      .then(() => {
        this._setPlayStatus('play');
        this._startTimer();
        this._equaliser.tryCreateContext(this._el);
        this.startVisualise();
      })
      .catch(err => {
        console.error('Can`t play track', err);
        this.stop();
        this.stopVisualise();
      });
  }

  public stop() {
    this._el.pause();
    this._clearTimer();
    this._setPlayStatus('stop');
  }

  public startPlay(listId: ID, trackId?: ID) {
    this._playTrack(listId, trackId);
  }

  public isListPlaying(listId: ID, listType: TrackListType) {
    if (!this.list) return false;
    return listId === this.list.id && listType === this.list.type;
  }

  public isTrackPlaying(listId: ID, listType: TrackListType, trackId: ID) {
    if (!this.list) return false;
    return this.isListPlaying(listId, listType) && this.tracks.current.id === trackId;
  }

  private _playTrack(listId: ID, trackId?: ID) {
    if (!this._el) return;

    const onSuccess: OnPlayerTracksFetched = x => {
      if (this.tracks && this.tracks.current.id === x.current.id) {
        this.rewind(0);
        this.play();
      } else {
        this._setTime({currentTime: 0, duration: 0});
        this._setPlayStatus('play');
      }
      this._setTracks(x);
      this._setList({...this.list, id: listId, type: x.listType});
      this._ranges$.next({ start: 0, end: 0 })
    }

    if (trackId) {
      this._fetchNextTrack(trackId, listId, onSuccess);
    } else {
      this._fetchFirstTrack(listId, onSuccess);
    }
  }

  public repeatTrack() {
    this._setCurrentTime(0);
    this.play();
    return;
  }

  public closePlayer() {
    if (!this._el) return;

    this._clearTimer();
    this._setPlayStatus('none');
    this._el.pause();
    this._setList(null);
    this.destroyVisualizer();
  }

  public playNext() {
    if (!this.tracks.next) {
      console.error('next track not existed', this.tracks);
      return;
    }

    this._playTrack(this.list.id, this.tracks.next.id);
  }

  public playPrevious() {
    if (!this.tracks.previous) {
      console.error('previous track not existed', this.tracks);
      return;
    }

    this._playTrack(this.list.id, this.tracks.previous.id);
  }

  public rewind(time: number) {
    if (time > this.time.duration) {
      console.debug('time value is more than duration', time);
      this._setCurrentTime(this.time.duration);
      return;
    }

    if (time < 0) {
      console.debug('time value is less than 0', time);
      this._setCurrentTime(0);
    }

    this._el.currentTime = time;
    this._setCurrentTime(time);
  }

  public setVolume(volume: number) {
    if (volume > 1) {
      console.debug('volume value is more than 1', volume);
      this.setVolume(1);
      return;
    }

    if (volume < 0) {
      console.debug('volume value is less than 0', volume);
      this.setVolume(0);
      return;
    }

    this._el.volume = volume;
    this._setVolume(volume);
  }

  public changeRepeat() {
    switch (this.statuses.repeat) {
      case "none":
        this._setRepeatStatus('track-list');
        break;
      case "track-list":
        this._setRepeatStatus('track');
        break;
      case "track":
        this._setRepeatStatus('none');
        break;
    }
  }

  public setFilterGain(gainValue: number, frequency: EqualizerFrequency) {
    if (!this.equalizerOn) this.turnOnEqualizer();
    if (!this.equalizerEnabled) return;

    let value = gainValue;
    if (value > 16) {
      console.debug('Gain value more than 16');
      value = 16;
    }
    if (value < -16) {
      console.debug('Gain value less than -16');
      value = -16;
    }
    this._equaliser.changeFilterGain(gainValue, frequency);
    const currentSettings = {...this.currentEqualizerSettings};
    currentSettings.gains = [...currentSettings.gains.map(x => x.frequency === frequency ? {...x, value} : x)];
    const settings = [...this.equalizerState.settings.map(x => x.name === currentSettings.name ? currentSettings : x)];
    this._setEqualizerSettings(settings);
  }

  public resetFiltersGains() {
    this._equaliser.resetFiltersGain();
    const currentSettings = {...this.currentEqualizerSettings};
    currentSettings.gains = [...currentSettings.gains.map(x => {
      return {...x, value: 0}
    })];
    const settings = [...this.equalizerState.settings.map(x => x.name === currentSettings.name ? currentSettings : x)];
    this._setEqualizerSettings(settings);
  }

  public setVisualiserColor(color: string) {
    this._setVisualiser({...this.visualiserState, color});
    this._equaliser.setVisualiserColor(color);
  }

  public createNewEqualiserSettings(name: string) {
    if (this.equalizerState.settings.map(x => x.name).includes(name)) {
      console.debug(`equaliser settings with "${name}" already exists`);
      return;
    }
    const newSettings: IEqualizerSettings = {
      name,
      gains: equalizerFrequencies.map(x => {
        return {
          frequency: x,
          value: 0
        }
      })
    };
    this._setEqualizerState({
      ...this.equalizerState,
      settings: [...this.equalizerState.settings, newSettings],
      selectedSettingsName: name
    });
  }

  public selectEqualiserSettings(selectedSettingsName: UniqueName) {
    if (!this.equalizerState.settings.map(x => x.name).includes(selectedSettingsName)) {
      console.debug(`equaliser settings with name "${selectedSettingsName}" not found`);
      return;
    }
    this._setEqualizerState({...this.equalizerState, selectedSettingsName});
  }

  private _prepareFirst() {
    this._fetchNextTrack(
      this.tracks.next.id,
      this.list.id,
      () => this._setTime({currentTime: 0, duration: 0})
    );
  }

  private _fetchNextTrack(trackId: ID, listId: ID, onSuccess: OnPlayerTracksFetched = noOp, onFail = noOp) {
    this._setLoadingField(true, 'fetchTrack');
    this._api.player.next(trackId, listId)
      .pipe(
        finalize(() => this._setLoadingField(false, 'fetchTrack'))
      )
      .subscribe(
        x => {
          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  private _fetchFirstTrack(listId: ID, onSuccess: OnPlayerTracksFetched = noOp, onFail = noOp) {
    this._setLoadingField(true, 'fetchTrack');
    this._api.player.first(listId)
      .pipe(
        finalize(() => this._setLoadingField(false, 'fetchTrack'))
      )
      .subscribe(
        x => {
          onSuccess(x);
        },
        () => {
          onFail();
        }
      );
  }

  private _startTimer() {
    this._clearTimer();
    this._timeIntervalId = setInterval(() => {
      const buffered = this._el.buffered;
      const duration = this._el.duration;
      const currentTime = this._el.currentTime;

      this._setCurrentTime(Math.round(currentTime));
      if (currentTime >= duration) this._clearTimer();

      try {
        let range = 0;
        while (!(buffered.start(range) <= currentTime && currentTime <= buffered.end(range))) {
          range += 1;
        }
        this._ranges$.next({
          start: buffered.start(range),
          end: buffered.end(range)
        });
      } catch (err) {

      }

    }, this._timeIntervalDelay);
  }

  private _clearTimer() {
    clearInterval(this._timeIntervalId);
  }

  private _setLoadingField(value: boolean, key: PlayerStoreLoadingField) {
    const loading = {...this.loading};
    loading[key] = value;
    this._changeState({...this.state$.value, loading});
  }

  private _setVolume(volume: number) {
    this._changeState({...this.state$.value, volume});
  }

  private _setPlayStatus(play: PlayTrackStatus) {
    this._setStatuses({...this.statuses, play});
  }

  private _setRepeatStatus(repeat: RepeatTrackStatus) {
    this._setStatuses({...this.statuses, repeat});
  }

  private _setStatuses(statuses: IPlayerStatuses) {
    this._changeState({...this.state$.value, statuses});
  }

  private _setList(list: IPlayerListState | null) {
    this._changeState({...this.state$.value, list});
  }

  private _setTracks(tracks: IPlayerResponse | null) {
    this._changeState({...this.state$.value, tracks});
  }

  private _setCurrentTime(currentTime: number) {
    this._setTime({...this.time, currentTime});
  }

  private _setTime(time: IPlayerTime) {
    this._changeState({...this.state$.value, time});
  }

  private _setEqualizerSettings(settings: IEqualizerSettings[]) {
    this._setEqualizerState({...this.equalizerState, settings});
  }

  private _setEqualizerState(equalizer: IPlayerEqualizerState) {
    this._changeState({...this.state$.value, equalizer});
  }

  private _setVisualiser(visualiser: IPlayerStoreVisualiserState) {
    this._changeState({...this.state$.value, visualiser});
  }

  private get _el(): HTMLAudioElement {
    return this._el$.getValue() as HTMLAudioElement;
  }

  private get _visualiserCanvas(): HTMLCanvasElement {
    return this._visualiserCanvas$.getValue() as HTMLCanvasElement;
  }

  public get isSingle(): boolean {
    return this.tracks.count === 1;
  }

  public get list(): IPlayerListState {
    return this.state$.getValue().list as IPlayerListState;
  }

  public get tracks(): IPlayerResponse {
    return this.state$.getValue().tracks as IPlayerResponse;
  }

  public get time(): IPlayerTime {
    return this.state$.getValue().time;
  }

  public get volume(): number {
    return this.state$.getValue().volume;
  }

  public get statuses(): IPlayerStatuses {
    return this.state$.getValue().statuses;
  }

  public get currentEqualizerSettings(): IEqualizerSettings {
    return this.equalizerState.settings.find(x => x.name === this.equalizerState.selectedSettingsName) as IEqualizerSettings;
  }

  public get equalizerState(): IPlayerEqualizerState {
    return this.state$.getValue().equalizer;
  }

  public get visualiserState(): IPlayerStoreVisualiserState {
    return this.state$.getValue().visualiser;
  }

  public get equalizerEnabled(): boolean {
    return this._equaliser.enabled;
  }

  public get equalizerOn(): boolean {
    return this._equalizerOn$.getValue();
  }

  public get showPlayer(): boolean {
    return (this._el && this.tracks && this.statuses.play !== 'none');
  }

  public get loading(): PlayerStoreLoadingState {
    return this.state$.getValue().loading;
  }

  public get ranges(): TimeRanges {
    return this._ranges$.getValue();
  }

}
