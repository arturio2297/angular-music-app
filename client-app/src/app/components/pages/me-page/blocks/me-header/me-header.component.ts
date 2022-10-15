import {Component} from "@angular/core";
import applicationUrls from "../../../../../models/navigation/navigation.models";

const urls = Object.values(applicationUrls).filter(x => x.parentValue === applicationUrls.me.value);

@Component({
  selector: 'app-me-header',
  templateUrl: './me-header.component.html',
  styleUrls: ['./me-header.component.less']
})
export class MeHeaderComponent {

  readonly urls = urls;

  constructor() {
  }

}
