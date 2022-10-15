import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-stop-indicator',
  templateUrl: './stop-indicator.component.html',
  styleUrls: ['./stop-indicator.component.less']
})
export class StopIndicatorComponent {

  @Input()
  bgColor: string;

}
