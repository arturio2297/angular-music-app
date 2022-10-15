import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import applicationUrls from "../models/navigation/navigation.models";
import {GroupsPageComponent} from "../components/pages/groups/groups-page/groups-page.component";
import {RoutesGuard} from "../services/routes.guard";

const {groups} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: GroupsPageComponent,
    title: groups.title,
    data: groups,
    canActivate: [RoutesGuard]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class GroupsRoutingModule {
}
