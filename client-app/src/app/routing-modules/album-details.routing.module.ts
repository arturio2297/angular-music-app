import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AlbumDetailsPageComponent} from "../components/pages/albums/album-details-page/album-details-page.component";
import {RoutesGuard} from "../services/routes.guard";
import applicationUrls from "../models/navigation/navigation.models";

const {albumDetails} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: AlbumDetailsPageComponent,
    title: albumDetails.title,
    data: albumDetails,
    canActivate: [RoutesGuard]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class AlbumDetailsRoutingModule {
}
