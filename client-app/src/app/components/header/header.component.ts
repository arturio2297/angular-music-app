import {Component, OnInit} from '@angular/core';
import {RootStore} from "../../stores/root.store";
import {BehaviorSubject} from "rxjs";
import ArrayUtils from "../../utils/array.utils";

const indicatorColors = ['white', 'magenta', 'lightgreen', 'skyblue', 'pink', 'orange', 'crimson', 'cyan', 'lime'];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  readonly currentColor$ = new BehaviorSubject(indicatorColors[0]);

  constructor(
    private _rootStore: RootStore
  ) {}

  public ngOnInit() {
    setInterval(() => {
      const nextColor = ArrayUtils.getNext(this.currentColor$.value, indicatorColors);
      this.currentColor$.next(nextColor || ArrayUtils.getFirst(indicatorColors));
    }, 2500);
  }

  public get showNavigation(): boolean {
    return this._rootStore.accountStore.account !== null;
  }

  public get isPlaying(): boolean {
    return this._rootStore.playerStore.statuses.play === 'play';
  }

}
