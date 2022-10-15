import {Component, HostListener, OnInit} from '@angular/core';
import {RootStore} from "./stores/root.store";
import {screenBrakeDowns} from "./models/store/ui.store.models";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  constructor(
    private _rootStore: RootStore
  ) {}

  public ngOnInit() {
    this._handleWindowResize();
  }

  @HostListener('window:resize')
  public onWindowResize() {
    this._handleWindowResize();
  }

  private _handleWindowResize() {
    const width = window.innerWidth;
    let screenBD = null;
    for (let i = 0; i < screenBrakeDowns.length; i++) {
      if (width <= screenBrakeDowns[i]) {
        screenBD = screenBrakeDowns[i];
        break;
      }
    }
    this._rootStore.uiStore.setScreenBD(screenBD);
  }

  public get loading(): boolean {
    return this._rootStore.accountStore.anyLoading;
  }

  public get showPlayer(): boolean {
    return !!(this._rootStore.playerStore.showPlayer && this._rootStore.accountStore.account);
  }

}
