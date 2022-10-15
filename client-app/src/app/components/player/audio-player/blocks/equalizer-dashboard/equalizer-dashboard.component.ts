import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild} from "@angular/core";
import {RootStore} from "../../../../../stores/root.store";
import {PlayerStore} from "../../../../../stores/player/player.store";
import {
  EqualizerFrequency, IEqualizerSettings,
  IPlayerEqualizerState
} from "../../../../../models/store/player.store.models";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-equalizer-dashboard',
  templateUrl: './equalizer-dashboard.component.html',
  styleUrls: ['./equalizer-dashboard.component.less']
})
export class EqualizerDashboardComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvasRef') private _canvasRef: ElementRef<HTMLCanvasElement>;

  @Output()
  onClose = new EventEmitter<void>();

  form = new FormGroup({
    color: new FormControl(this._playerStore.visualiserState.color)
  });

  constructor(
    private _rootStore: RootStore
  ) {
  }

  public ngAfterViewInit() {
    this._playerStore.initVisualiser(this._canvasRef.nativeElement);
  }

  public ngOnDestroy() {
    this._playerStore.destroyVisualizer();
  }

  public onVisualiserColorChange(color: string) {
    this._playerStore.setVisualiserColor(color);
  }

  public onResetSettingsClick() {
    this._playerStore.resetFiltersGains();
  }

  public onGainChange(value: number, frequency: EqualizerFrequency) {
    this._playerStore.setFilterGain(value, frequency);
  }

  public onTurnEqualizerChange(value: boolean) {
    value ?
      this._playerStore.turnOnEqualizer()
      :
      this._playerStore.turnOffEqualizer();
  }

  public get equalizerOn(): boolean {
    return this._playerStore.equalizerOn;
  }

  public get currentSettings(): IEqualizerSettings {
    return this._playerStore.currentEqualizerSettings;
  }

  public get equalizer(): IPlayerEqualizerState {
    return this._playerStore.equalizerState;
  }

  private get _playerStore(): PlayerStore {
    return this._rootStore.playerStore;
  }

}
