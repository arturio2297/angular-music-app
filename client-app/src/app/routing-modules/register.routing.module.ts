import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import applicationUrls from "../models/navigation/navigation.models";
import {RegistrationPageComponent} from "../components/pages/registration-page/registration-page.component";
import {RoutesGuard} from "../services/routes.guard";

const {registration} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: RegistrationPageComponent,
    title: registration.title,
    pathMatch: 'full',
    data: registration,
    canActivate: [RoutesGuard]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class RegisterRoutingModule {
}
