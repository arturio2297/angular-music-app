import {Component, Input} from '@angular/core';

export type AlertType = 'info' | 'warning' | 'danger' | 'success';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.less']
})
export class AlertComponent {

  @Input()
  type: AlertType = 'info';

  constructor() { }

}
