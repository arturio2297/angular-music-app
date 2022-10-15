import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {EditGroupPageComponent} from "../components/pages/groups/edit-group-page/edit-group-page.component";
import {RoutesGuard} from "../services/routes.guard";
import applicationUrls from "../models/navigation/navigation.models";

const {editGroup} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: EditGroupPageComponent,
    title: editGroup.title,
    data: editGroup,
    canActivate: [RoutesGuard]
  }
]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class EditGroupRoutingModule {
}
