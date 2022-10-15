import {Component, Input} from '@angular/core';
import {Toast, ToastsService} from "../../../services/toasts.service";

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.less']
})
export class ToastsComponent {

  @Input()
  showPlayer = false;

  constructor(private _toastsService: ToastsService) { }

  public stopToastTimer(toast: Toast) {
    toast.stopTimer();
  }

  public startToastTimer(toast: Toast) {
    toast.startTimer();
  }

  public get toasts(): Toast[] {
    return this._toastsService.toasts;
  }

}
