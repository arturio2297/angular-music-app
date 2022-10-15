import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import applicationUrls from "../models/navigation/navigation.models";
import {LoginPageComponent} from "../components/pages/login-page/login-page.component";
import {RoutesGuard} from "../services/routes.guard";

const {login} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    title: login.title,
    pathMatch: 'full',
    data: login,
    canActivate: [RoutesGuard]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class LoginRoutingModule {
}
