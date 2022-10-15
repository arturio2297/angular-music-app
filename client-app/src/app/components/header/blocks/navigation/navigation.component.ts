import {Component} from '@angular/core';
import applicationUrls, {IApplicationUrl} from "../../../../models/navigation/navigation.models";

const navigationUrls: IApplicationUrl[] = Object.values(applicationUrls).filter(x => x.isNavigation);

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.less']
})
export class NavigationComponent {

  urls = navigationUrls;

  constructor() { }

}
