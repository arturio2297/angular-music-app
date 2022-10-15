import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {GroupDetailsPageComponent} from "../components/pages/groups/group-details-page/group-details-page.component";
import {RoutesGuard} from "../services/routes.guard";
import {GroupAlbumsPageComponent} from "../components/pages/groups/group-details-page/group-albums-page/group-albums-page.component";
import {GroupTracksPageComponent} from "../components/pages/groups/group-details-page/group-tracks-page/group-tracks-page.component";
import applicationUrls from "../models/navigation/navigation.models";

const {groupDetails, groupAlbums, groupTracks} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: GroupDetailsPageComponent,
    title: groupDetails.title,
    data: groupDetails,
    canActivate: [RoutesGuard],
    children: [
      {
        path: groupAlbums.value,
        component: GroupAlbumsPageComponent,
        title: groupAlbums.title,
        data: groupAlbums,
        pathMatch: 'full'
      },
      {
        path: groupTracks.value,
        component: GroupTracksPageComponent,
        title: groupTracks.title,
        data: groupTracks,
        pathMatch: 'full'
      },
      { path: '**', redirectTo: groupAlbums.value }
    ]
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class GroupDetailsRoutingModule {
}
