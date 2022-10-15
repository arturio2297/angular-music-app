import {noOp} from "../../models/common/common.models";
import {BehaviorSubject} from "rxjs";
import AudioUtils from "../../utils/audio.utils";
import {IEqualizerGain} from "../../models/store/player.store.models";

export type OnCreateAudioContextFail = (error?: any) => void;

export class Equalizer {

  private readonly _enabled$ = new BehaviorSubject(true);
  context: AudioContext;
  source: MediaElementAudioSourceNode;
  filters: BiquadFilterNode[] = [];
  nodes: AudioNode[] = [];
  analyser: AnalyserNode;
  visualiserColor: string;
  private _analyserIntervalId: any;
  private readonly _analyserDelay = 25;

  constructor() {
  }

  public tryCreateContext(el: HTMLAudioElement, onFail: OnCreateAudioContextFail = noOp) {
    if (!this._enabled$.value || this.context) return;

    const context = AudioUtils.createAudioContext();

    if (!context) {
      this._enabled$.next(false);
      onFail();
      return;
    }

    const source = AudioUtils.connectAudioToContext(el, context);
    const analyser = AudioUtils.createAnalyser(context, source);
    this.context = context;
    this.source = source;
    this.analyser = analyser;
  }

  public turnOn(frequencies: number[], gains: IEqualizerGain[]) {
    if (!this.context) return;

    this.filters = AudioUtils.createFilters(this.context, 'peaking', frequencies);

    gains.forEach(x => {
      const filter = this._findFilter(x.frequency) as BiquadFilterNode;
      filter.gain.value = x.value;
    });

    this.nodes = AudioUtils.connectFilters(this.filters, this.context, this.source);
  }

  public changeFilterGain(gainValue: number, frequency: number) {
    const filter = this._findFilter(frequency);

    if (!filter)
      throw new Error(`Filter for frequency "${frequency}" not found`);

    filter.gain.value = gainValue;
  }

  public resetFiltersGain() {
    this.filters.forEach(x => x.gain.value = 0);
  }

  public turnOff() {
    this.nodes.forEach(x => x.disconnect());
  }

  public startVisualise(visualiserCanvas: HTMLCanvasElement) {
    if (!this.context) return;

    this.stopVisualise();
    this._analyserIntervalId = setInterval(() => {
      AudioUtils.visualiseWaves(this.analyser, visualiserCanvas, this.visualiserColor);
    }, this._analyserDelay);
  }

  public setVisualiserColor(color: string) {
    this.visualiserColor = color;
  }

  public stopVisualise() {
    clearInterval(this._analyserIntervalId);
  }

  private _findFilter(frequency: number) {
    return this.filters.find(x => x.frequency.value === frequency);
  }

  public get enabled(): boolean {
    return this._enabled$.getValue();
  }

}
