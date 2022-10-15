import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-play-indicator',
  templateUrl: './play-indicator.component.html',
  styleUrls: ['./play-indicator.component.less']
})
export class PlayIndicatorComponent {

  @Input()
  bgColor = 'white';

}
