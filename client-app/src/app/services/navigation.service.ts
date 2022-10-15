import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {noOp} from "../models/common/common.models";
import applicationUrls from "../models/navigation/navigation.models";
import {BehaviorSubject} from "rxjs";

type Command = string | number;

type Commands = Command[];

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  appUrls = applicationUrls;

  afterSuccessLoginRedirect$ = new BehaviorSubject<string | null>(null);

  constructor(private _router: Router) { }

  public handleLogin() {
    if (this.afterSuccessLoginRedirect$.value) {
      this._navigate(noOp, noOp, this.afterSuccessLoginRedirect$.value);
      return;
    }

    if (this.url === this.appUrls.login.value || this.url === this.appUrls.registration.value) {
      this.toMain();
    }
  }

  public handleLogout() {
    this.toLogin();
  }

  public toAccount() {
    this._navigate(noOp, noOp, this.appUrls.account.value);
  }

  public toLogin() {
    this._navigate(noOp, noOp, this.appUrls.login.value);
  }

  public toMain() {
    this._navigate(noOp, noOp, this.appUrls.me.value);
  }

  public toGroups() {
    this._navigate(noOp, noOp, this.appUrls.groups.value);
  }

  public toGroupDetails(id: ID) {
    this._navigate(noOp, noOp, this.appUrls.groupDetails.value.replace(':id', id));
  }

  public toCreateGroup() {
    this._navigate(noOp, noOp, this.appUrls.createGroup.value);
  }

  public toEditGroup(id: ID) {
    this._navigate(noOp, noOp, this.appUrls.editGroup.value.replace(':id', id));
  }

  public toAlbums() {
    this._navigate(noOp, noOp, this.appUrls.albums.value);
  }

  public toAlbumDetails(id: ID) {
    this._navigate(noOp, noOp, this.appUrls.albumDetails.value.replace(':id', id));
  }

  public toCreateAlbum() {
    this._navigate(noOp, noOp, this.appUrls.createAlbum.value);
  }

  public toEditAlbum(id: ID) {
    this._navigate(noOp, noOp, this.appUrls.editAlbum.value.replace(':id', id));
  }

  public toTrackLists() {
    this._navigate(noOp, noOp, this.appUrls.trackLists.value);
  }

  public toTrackListDetails(id: ID) {
    this._navigate(noOp, noOp, this.appUrls.trackListDetails.value.replace(':id', id));
  }

  public toCreateTrackList() {
    this._navigate(noOp, noOp, this.appUrls.createTrackList.value);
  }

  public toEditTrackList(id: ID) {
    this._navigate(noOp, noOp, this.appUrls.editTrackList.value.replace(':id', id));
  }

  private _navigate(onSuccess = noOp, onFail = noOp, ...commands: Commands) {
    this._router.navigate(commands)
      .then(onSuccess)
      .catch(err => {
        console.error('navigate error', commands, err);
        onFail();
      });
  }

  public get url (): string {
    return this._router.url.replace('/', '');
  }

  public get is() {
    return {
      accountPage: this.url === this.appUrls.account.value
    }
  }
}
