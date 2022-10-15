import {Component, Input} from "@angular/core";

type CounterValue = number | null;

@Component({
  selector: 'app-item-counters',
  templateUrl: './item-counters.component.html',
  styleUrls: ['./item-counters.component.less']
})
export class ItemCountersComponent {

  @Input()
  listeningCount: CounterValue = null;

  @Input()
  likesCount: CounterValue = null;

  @Input()
  albumCount: CounterValue = null;

  @Input()
  tracksCount: CounterValue = null;

}
