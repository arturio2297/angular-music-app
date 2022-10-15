import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CreateTrackListPageComponent} from "../components/pages/track-lists/create-track-list-page/create-track-list-page.component";
import {RoutesGuard} from "../services/routes.guard";
import applicationUrls from "../models/navigation/navigation.models";

const {createTrackList} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: CreateTrackListPageComponent,
    title: createTrackList.title,
    data: createTrackList,
    canActivate: [RoutesGuard]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class CreateTrackListRoutingModule {
}
