import {Component} from "@angular/core";
import {NavigationService} from "../../../../../../services/navigation.service";

@Component({
  selector: 'app-create-track-list-header',
  templateUrl: './create-track-list-header.component.html',
  styleUrls: ['./create-track-list-header.component.less']
})
export class CreateTrackListHeaderComponent {

  constructor(public navigationService: NavigationService) {
  }

}
