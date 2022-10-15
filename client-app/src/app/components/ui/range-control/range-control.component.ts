import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input, OnDestroy, OnInit,
  Output, Renderer2,
  ViewChild
} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Action} from "../../../models/common/common.models";
import {RootStore} from "../../../stores/root.store";
import {UiStore} from "../../../stores/ui/ui.store";
import DateUtils from "../../../utils/date.utils";

@Component({
  selector: 'app-range-control',
  templateUrl: './range-control.component.html',
  styleUrls: ['./range-control.component.less']
})
export class RangeControlComponent implements OnInit, OnDestroy {

  @ViewChild('durationRef') private _durationRef: ElementRef<HTMLDivElement>;
  @ViewChild('sliderRef') private _sliderRef: ElementRef<HTMLDivElement>;

  readonly isGrab$ = new BehaviorSubject(false);
  readonly sliderXPosition$ = new BehaviorSubject<string | null>(null);
  readonly sliderYPosition$ = new BehaviorSubject<string | null>(null);
  readonly hintXPosition$ = new BehaviorSubject('');
  readonly hintYPosition$ = new BehaviorSubject('');
  readonly hint$ = new BehaviorSubject('');

  @Output()
  onChange = new EventEmitter<number>();

  @Input()
  orientation: 'vertical' | 'horizontal' = 'horizontal';

  @Input()
  hintType: 'absolute' | 'percent' | 'time' = 'percent';

  @Input()
  step = 0.1;

  @Input()
  valueTuning = 0;

  @Input()
  absoluteFractionDigits = 1;

  @Input()
  max = 0;

  @Input()
  cur = 0;

  @Input()
  containerId: string;

  private _unlisteners: Action[];

  constructor(
    private _rendered: Renderer2,
    private _rootStore: RootStore
  ) {
  }

  public ngOnInit() {
    const hintValue = this.cur + this.valueTuning;
    this.hint$.next(String(hintValue.toFixed(this.absoluteFractionDigits)));

    let element = this._uiStore.getAppContainer();
    if (this.containerId) {
      element = document.getElementById(this.containerId) as HTMLElement;
      if (!element)
        throw new Error('Container not found');
    }
    const u1 = this._rendered.listen(element, 'mousemove', this.onWindowMouseMove.bind(this));
    const u2 = this._rendered.listen(element, 'mouseup', this.onWindowMouseUp.bind(this));
    this._unlisteners = [u1, u2];
  }

  public ngOnDestroy() {
    this._unlisteners.forEach(x => x());
  }

  public onWheelUp() {
    if (this.cur > this.max) return;
    this.onChange.emit(this.cur + this.step + this.valueTuning);
  }

  public onWheelDown() {
    if (this.cur < 0) return;
    this.onChange.emit(this.cur - this.step + this.valueTuning);
  }

  public onWindowMouseMove(event: any) {
    if (!this.isGrab$.value) return;

    switch (this.orientation) {
      case "horizontal":
        this.sliderXPosition$.next(this._calcXPosition(event) + 'px');
        break;
      case "vertical":
        this.sliderYPosition$.next(this._calcYPosition(event) + 'px');
    }
    this._setHintContent(event);
  }

  public onWindowMouseUp(event: any) {
    this.isGrab$.next(false);
    if (!this.sliderXPosition$.value) return;

    const x = Number(this.sliderXPosition$.value.replace('px', ''));
    const {offsetWidth} = this._refs.duration;
    const value = (x / offsetWidth) * this.max;
    this.onChange.emit(value);
    this.sliderXPosition$.next(null);
  }

  @HostListener('mousemove', ['$event'])
  public onMouseMove(event: any) {
    this._setHintContent(event);
  }

  private _setHintContent(event: any) {
    let percent, absolute;

    switch (this.orientation) {
      case "horizontal":
        const x = this._calcXPosition(event);
        this.hintXPosition$.next(x + 'px');
        const {offsetWidth} = this._refs.duration;
        percent = Math.round(x / offsetWidth * 100);
        absolute = x / offsetWidth * this.max;
        break;
      case "vertical":
        const y = this._calcYPosition(event);
        this.hintYPosition$.next(y + 'px');
        const {offsetHeight} = this._refs.duration;
        percent = Math.round(y / offsetHeight * 100);
        absolute = y / offsetHeight * this.max;
        break;
    }

    switch (this.hintType) {
      case "percent":
        this.hint$.next(String(percent));
        break;
      case "time":
        this.hint$.next(DateUtils.prettyTime(absolute));
        break;
      case "absolute":
        this.hint$.next(String((absolute + this.valueTuning).toFixed(this.absoluteFractionDigits)))
    }
  }

  private _calcXPosition(event: any): number {
    let x = event.clientX;
    const {duration} = this._refs;
    const {left, right} = duration.getBoundingClientRect();
    x = x < left ? left : (x > right ? right : x);
    return x - left;
  }

  private _calcYPosition(event: any): number {
    let y = event.clientY;
    const {duration} = this._refs;
    const {top, bottom} = duration.getBoundingClientRect();
    y = y < top ? top : (y > bottom ? bottom : y);
    return -(y - bottom);
  }

  @HostListener('mousedown')
  public onMouseDown() {
    this.isGrab$.next(true);
  }

  @HostListener('mouseup', ['$event'])
  public onMouseUp(event: any) {
    this.isGrab$.next(false);
    const target = event.target;
    const {slider, duration} = this._refs;
    let value;

    switch (this.orientation) {
      case "horizontal":
        let x;
        if (target === this._refs.slider) {
          const sliderLeft = slider.getBoundingClientRect().left;
          const sliderRight = slider.getBoundingClientRect().right;
          const sliderMiddle = sliderLeft + (sliderRight - sliderLeft) / 2;
          const durationLeft = duration.getBoundingClientRect().left;
          x = sliderMiddle - durationLeft;
        } else {
          x = event.clientX - duration.getBoundingClientRect().left;
        }
        value = (x / this._refs.duration.offsetWidth) * this.max;
        break;
      case "vertical":
        let y;
        if (target === this._refs.slider) {
          const sliderTop = slider.getBoundingClientRect().top;
          const sliderBottom = slider.getBoundingClientRect().bottom;
          const sliderMiddle = sliderBottom + (sliderTop - sliderBottom) / 2;
          const durationTop = duration.getBoundingClientRect().top;
          y = sliderMiddle - durationTop;
        } else {
          y = event.clientY - duration.getBoundingClientRect().top;
        }
        value = (y / this._refs.duration.offsetHeight) * this.max;
        value = -(value + this.valueTuning);
        break;
    }
    this.onChange.emit(value);
  }

  public get percentPosition(): string {
    return Math.round(this.cur / this.max * 100) + '%';
  }

  private get _refs() {
    return {
      duration: this._durationRef.nativeElement,
      slider: this._sliderRef.nativeElement
    }
  }

  private get _uiStore(): UiStore {
    return this._rootStore.uiStore;
  }

}
