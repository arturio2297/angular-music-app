import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AlbumsPageComponent} from "../components/pages/albums/albums-page/albums-page.component";
import {RoutesGuard} from "../services/routes.guard";
import applicationUrls from "../models/navigation/navigation.models";

const {albums} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: AlbumsPageComponent,
    title: albums.title,
    data: albums,
    canActivate: [RoutesGuard]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class AlbumsRoutingModule {
}
