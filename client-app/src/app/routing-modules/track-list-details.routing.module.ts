import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TrackListDetailsPageComponent} from "../components/pages/track-lists/track-list-details-page/track-list-details-page.component";
import {RoutesGuard} from "../services/routes.guard";
import applicationUrls from "../models/navigation/navigation.models";

const {trackListDetails} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: TrackListDetailsPageComponent,
    title: trackListDetails.title,
    data: trackListDetails,
    canActivate: [RoutesGuard]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class TrackListDetailsRoutingModule {
}
