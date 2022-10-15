import {Directive, HostBinding, HostListener, Input} from "@angular/core";
import {Action} from "../models/common/common.models";

@Directive({
  selector: '[hint]'
})
export class HintDirective {

  @Input()
  delay = 250;

  @Input()
  showHint: boolean;

  @Input()
  hideHint: boolean;

  @HostBinding('class.hint')
  hint = true;

  _show = false;

  private _timerId: any;

  @HostListener('mouseenter')
  public onMouseEnter() {
    this._startTimer(() => {
      this._show = true;
    });
  }

  @HostListener('mouseleave')
  public onMouseLeave() {
    this._startTimer(() => {
      this._show = false;
    });
  }

  private _startTimer(callback: Action) {
    this._clearTimer();
    this._timerId = setTimeout(callback, this.delay);
  }

  private _clearTimer() {
    clearTimeout(this._timerId);
  }

  @HostBinding('class.hint-show')
  public get show(): boolean {
    return (this.showHint || this._show) && !this.hideHint;
  }

}
