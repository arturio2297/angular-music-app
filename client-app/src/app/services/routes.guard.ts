import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {RootStore} from "../stores/root.store";
import {map, Observable} from "rxjs";
import {NavigationService} from "./navigation.service";
import {IApplicationUrl} from "../models/navigation/navigation.models";
import {AuthStorageService} from "./storage/auth.storage.service";

@Injectable({
  providedIn: 'root'
})
export class RoutesGuard implements CanActivate {

  constructor(
    private _rootStore: RootStore,
    private _navigationService: NavigationService,
    private _authStorage: AuthStorageService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const data = route.data as IApplicationUrl;
    return this._rootStore.state$
      .asObservable()
      .pipe(map(x => {

        if (!data) {
          console.error('url data not have data');
          return true;
        }

        const account = x.accountState.account;

        console.debug('route guard', data, account);

        if (!account && this._authStorage.getStatus() !== 'none' && !data.isOnlyPublic) {
          console.debug('Token exists, but account info not download yet, save url and try redirect user after success login');
          this._navigationService.afterSuccessLoginRedirect$.next(state.url);
        }

        if (!account && data.acceptRoles.length) {
          console.debug('Account data empty and route is private, redirect user to login');
          this._navigationService.toLogin();
          return false;
        }

        if (account && data.isOnlyPublic) {
          console.debug('Account data is fetched, but route is only public. Redirect to main route');
          this._navigationService.toMain();
          return false;
        }

        if (account && !data.acceptRoles.includes(account.role)) {
          console.debug('Account data is fetched, but user role not accept to this route. Redirect to main');
          this._navigationService.toMain();
          return false;
        }

        return true;
      }));
  }

}
