import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TrackListsPageComponent} from "../components/pages/track-lists/track-lists-page/track-lists-page.component";
import {RoutesGuard} from "../services/routes.guard";
import applicationUrls from "../models/navigation/navigation.models";

const {trackLists} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: TrackListsPageComponent,
    title: trackLists.title,
    data: trackLists,
    canActivate: [RoutesGuard]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class TrackListsRoutingModule {
}
