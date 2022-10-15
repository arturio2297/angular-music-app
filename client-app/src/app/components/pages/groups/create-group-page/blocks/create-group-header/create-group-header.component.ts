import { Component } from '@angular/core';
import {NavigationService} from "../../../../../../services/navigation.service";

@Component({
  selector: 'app-create-group-header',
  templateUrl: './create-group-header.component.html',
  styleUrls: ['./create-group-header.component.less']
})
export class CreateGroupHeaderComponent {

  constructor(public navigationService: NavigationService) { }

}
