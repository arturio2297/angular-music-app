import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CreateAlbumPageComponent} from "../components/pages/albums/create-album-page/create-album-page.component";
import {RoutesGuard} from "../services/routes.guard";
import applicationUrls from "../models/navigation/navigation.models";

const {createAlbum} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: CreateAlbumPageComponent,
    title: createAlbum.title,
    data: createAlbum,
    canActivate: [RoutesGuard]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class CreateAlbumRoutingModule {
}
