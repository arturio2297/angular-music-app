import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MePageComponent} from "./components/pages/me-page/me-page.component";
import {GroupsPageComponent} from "./components/pages/groups/groups-page/groups-page.component";
import {AlbumsPageComponent} from "./components/pages/albums/albums-page/albums-page.component";
import {TrackListsPageComponent} from "./components/pages/track-lists/track-lists-page/track-lists-page.component";
import {GroupDetailsPageComponent} from "./components/pages/groups/group-details-page/group-details-page.component";
import {AlbumDetailsPageComponent} from "./components/pages/albums/album-details-page/album-details-page.component";
import {TrackListDetailsPageComponent} from "./components/pages/track-lists/track-list-details-page/track-list-details-page.component";
import {RoutesGuard} from "./services/routes.guard";
import applicationUrls from "./models/navigation/navigation.models";
import {AccountPageComponent} from "./components/pages/account-page/account-page.component";
import {CreateAlbumPageComponent} from "./components/pages/albums/create-album-page/create-album-page.component";
import {EditAlbumPageComponent} from "./components/pages/albums/edit-album-page/edit-album-page.component";
import {CreateTrackListPageComponent} from "./components/pages/track-lists/create-track-list-page/create-track-list-page.component";
import {EditTrackListPageComponent} from "./components/pages/track-lists/edit-track-list-page/edit-track-list-page.component";

const {
  login,
  registration,
  me,
  groups,
  groupDetails,
  createGroup,
  editGroup,
  albums,
  albumDetails,
  createAlbum,
  editAlbum,
  trackLists,
  trackListDetails,
  createTrackList,
  editTrackList,
  account
} = applicationUrls;

const routes: Routes =
  [
    //Only public pages >>>
    {
      path: login.value,
      loadChildren: () => import('./routing-modules/login.routing.module').then(x => x.LoginRoutingModule)
    },
    {
      path: registration.value,
      loadChildren: () => import('./routing-modules/register.routing.module').then(x => x.RegisterRoutingModule)
    },
    //Only public pages <<<

    //Main page >>>
    {
      path: me.value,
      loadChildren: () => import('./routing-modules/me.routing.module').then(x => x.MeRoutingModule)
    },
    //Main page

    //Groups pages >>>
    {
      path: groups.value,
      loadChildren: () => import('./routing-modules/groups.routing.module').then(x => x.GroupsRoutingModule)
    },
    {
      path: groupDetails.value,
      loadChildren: () => import('./routing-modules/group-details.routing.module').then(x => x.GroupDetailsRoutingModule)
    },
    {
      path: createGroup.value,
      loadChildren: () => import('./routing-modules/create-group.routing.module').then(x => x.CreateGroupRoutingModule)
    },
    {
      path: editGroup.value,
      loadChildren: () => import('./routing-modules/edit-group.routing.module').then(x => x.EditGroupRoutingModule)
    },
    //Groups pages <<<

    //Albums pages >>>
    {
      path: albums.value,
      loadChildren: () => import('./routing-modules/albums.routing.module').then(x => x.AlbumsRoutingModule)
    },
    {
      path: albumDetails.value,
      loadChildren: () => import('./routing-modules/album-details.routing.module').then(x => x.AlbumDetailsRoutingModule)
    },
    {
      path: createAlbum.value,
      loadChildren: () => import('./routing-modules/create-album.routing.module').then(x => x.CreateAlbumRoutingModule)
    },
    {
      path: editAlbum.value,
      loadChildren: () => import('./routing-modules/edit-album.routing.module').then(x => x.EditAlbumRoutingModule)
    },
    //Albums pages <<<

    //Track list pages >>>
    {
      path: trackLists.value,
      loadChildren: () => import('./routing-modules/track-lists.routing.module').then(x => x.TrackListsRoutingModule)
    },
    {
      path: trackListDetails.value,
      loadChildren: () => import('./routing-modules/track-list-details.routing.module').then(x => x.TrackListDetailsRoutingModule)
    },
    {
      path: createTrackList.value,
      loadChildren: () => import('./routing-modules/create-track-list.routing.module').then(x => x.CreateTrackListRoutingModule)
    },
    {
      path: editTrackList.value,
      loadChildren: () => import('./routing-modules/edit-track-list-routing.module').then(x => x.EditTrackListRoutingModule)
    },
    //Track list pages <<<

    //Account pages >>>
    {
      path: account.value,
      loadChildren: () => import('./routing-modules/account.routing.module').then(x => x.AccountRoutingModule)
    },
    //Account pages <<<

    {path: '**', redirectTo: me.value}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
