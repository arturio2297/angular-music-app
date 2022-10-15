import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MePageComponent} from "../components/pages/me-page/me-page.component";
import applicationUrls from "../models/navigation/navigation.models";
import {RoutesGuard} from "../services/routes.guard";
import {MeMainPageComponent} from "../components/pages/me-page/me-main/me-main-page.component";
import {MeTracksPageComponent} from "../components/pages/me-page/me-tracks-page/me-tracks-page.component";
import {MeAlbumsPageComponent} from "../components/pages/me-page/me-albums-page/me-albums-page.component";
import {MeTrackListsPageComponent} from "../components/pages/me-page/me-track-lists-page/me-track-lists-page.component";

const {me, meMain, meTracks, meAlbums, meTrackLists} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: MePageComponent,
    title: me.title,
    data: me,
    canActivate: [RoutesGuard],
    children: [
      {
        path: meMain.value,
        component: MeMainPageComponent,
        title: meMain.title,
        data: meMain,
        pathMatch: 'full'
      },
      {
        path: meTracks.value,
        component: MeTracksPageComponent,
        title: meTracks.title,
        data: meTracks,
        pathMatch: 'full'
      },
      {
        path: meAlbums.value,
        component: MeAlbumsPageComponent,
        title: meAlbums.title,
        data: meAlbums,
        pathMatch: 'full'
      },
      {
        path: meTrackLists.value,
        component: MeTrackListsPageComponent,
        title: meTrackLists.title,
        data: meTrackLists,
        pathMatch: 'full'
      },
      {path: '**', redirectTo: meMain.value}
    ]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class MeRoutingModule {
}
