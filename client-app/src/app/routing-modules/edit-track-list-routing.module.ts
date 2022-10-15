import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {EditTrackListPageComponent} from "../components/pages/track-lists/edit-track-list-page/edit-track-list-page.component";
import {RoutesGuard} from "../services/routes.guard";
import applicationUrls from "../models/navigation/navigation.models";

const {editTrackList} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: EditTrackListPageComponent,
    title: editTrackList.title,
    data: editTrackList,
    canActivate: [RoutesGuard]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class EditTrackListRoutingModule {
}
