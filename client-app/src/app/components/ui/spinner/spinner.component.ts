import {Component, Input, OnInit} from '@angular/core';

export type SpinnerSize =  'ss' |'s' | 'm' | 'l' | 'x' | 'xl' | 'xxl';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.less']
})
export class SpinnerComponent implements OnInit {

  @Input()
  size: SpinnerSize = 'm';

  constructor() { }

  ngOnInit(): void {
  }

}
