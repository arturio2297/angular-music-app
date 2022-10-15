import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AccountPageComponent} from "../components/pages/account-page/account-page.component";
import {RoutesGuard} from "../services/routes.guard";
import applicationUrls from "../models/navigation/navigation.models";

const {account} = applicationUrls;

const routes: Routes = [
  {
    path: '',
    component: AccountPageComponent,
    title: account.title,
    data: account,
    canActivate: [RoutesGuard]
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class AccountRoutingModule {
}
