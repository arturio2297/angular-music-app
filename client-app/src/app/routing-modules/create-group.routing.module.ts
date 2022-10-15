import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CreateGroupPageComponent} from "../components/pages/groups/create-group-page/create-group-page.component";
import {RoutesGuard} from "../services/routes.guard";
import applicationUrls from "../models/navigation/navigation.models";

const {createGroup} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: CreateGroupPageComponent,
    title: createGroup.title,
    data: createGroup,
    canActivate: [RoutesGuard]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class CreateGroupRoutingModule {
}
