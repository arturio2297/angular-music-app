import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {EditAlbumPageComponent} from "../components/pages/albums/edit-album-page/edit-album-page.component";
import {RoutesGuard} from "../services/routes.guard";
import applicationUrls from "../models/navigation/navigation.models";

const {editAlbum} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: EditAlbumPageComponent,
    title: editAlbum.title,
    data: editAlbum,
    canActivate: [RoutesGuard]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class EditAlbumRoutingModule {
}
