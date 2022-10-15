import {Directive, EventEmitter, HostListener, Input, Output} from "@angular/core";
import {Action} from "../models/common/common.models";

@Directive({
  selector: '[scroll]'
})
export class ScrollDirective {

  @Input()
  scrollDelay = 500;

  @Input()
  scrollPoint = 50;

  private _timerId: any;

  @Output()
  onScrollDown = new EventEmitter<void>();

  @HostListener('scroll', ['$event'])
  public onScroll(ev: any) {
    const {scrollHeight, scrollTop, clientHeight} = ev.target;
    const condition = scrollHeight - (clientHeight + scrollTop) < this.scrollPoint;
    condition && this._startTimer(() => this.onScrollDown.emit());
  }

  private _startTimer(callback: Action) {
    this._clearTimer();
    this._timerId = setTimeout(callback, this.scrollDelay);
  }

  private _clearTimer() {
    clearTimeout(this._timerId);
  }

}
