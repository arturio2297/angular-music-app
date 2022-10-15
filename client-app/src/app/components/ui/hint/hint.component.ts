import {Component, Input} from "@angular/core";

export type HintPosition = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left'
  | 'bottom-right';

@Component({
  selector: 'app-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.less']
})
export class HintComponent {

  @Input()
  position?: HintPosition;

}
