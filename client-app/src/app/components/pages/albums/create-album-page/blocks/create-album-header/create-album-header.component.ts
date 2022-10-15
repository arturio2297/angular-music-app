import {Component} from "@angular/core";
import {NavigationService} from "../../../../../../services/navigation.service";

@Component({
  selector: 'app-create-album-header',
  templateUrl: './create-album-header.component.html',
  styleUrls: ['./create-album-header.component.less']
})
export class CreateAlbumHeaderComponent {

  constructor(public navigationService: NavigationService) {
  }

}
