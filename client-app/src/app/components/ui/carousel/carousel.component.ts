import {Component, Input, OnInit} from "@angular/core";
import {RootStore} from "../../../stores/root.store";
import {ApiService} from "../../../services/api/api.service";
import {ITrackItem, TrackListType} from "../../../models/api/track.models";
import ArrayUtils from "../../../utils/array.utils";
import {PlayerStore} from "../../../stores/player/player.store";
import {PlayTrackStatus} from "../../../models/store/player.store.models";
import {BehaviorSubject} from "rxjs";
import {ScreenBD} from "../../../models/store/ui.store.models";
import {UiStore} from "../../../stores/ui/ui.store";

export type CarouselItemType = 'album' | 'track-list';

export interface ICarouselItem {
  id: ID;
  name: UniqueName;
  liked: boolean;
  saved: boolean;
  listening: number;
  likesCount: number;
  tracks: ITrackItem[];
  tracksCount: number;
  groupName?: UniqueName;
  groupId?: ID;
  authorUsername?: UniqueName;
  authorId?: ID;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.less']
})
export class CarouselComponent<T extends ICarouselItem> implements OnInit {

  readonly page$ = new BehaviorSubject(0);
  readonly shift$ = new BehaviorSubject('+ 0rem');
  itemsOnPage = 4;

  @Input()
  itemsType: CarouselItemType;

  @Input()
  items = [] as ICarouselItem[];

  @Input()
  totalItems = 0;

  constructor(
    private _rootStore: RootStore,
    private _api: ApiService
  ) {}

  public ngOnInit() {
    this._uiStore.screenBD$.subscribe(x => {
      let itemsOnPage = 4;
      if (x === ScreenBD.XL || x === ScreenBD.LG) {
        itemsOnPage = 3;
      }
      if (x === ScreenBD.MD || x === ScreenBD.SM) {
        itemsOnPage = 2;
      }
      if (itemsOnPage === this.itemsOnPage) return;

      this.itemsOnPage = itemsOnPage;
      if (this.page$.value > this.totalPages - 1) {
        this.page$.next(this.totalPages - 1);
      }
    });
  }

  public toPage(page: number) {
    this.page$.next(page);
  }

  public toNextPage() {
    if (this.isLastPage) return;
    this.page$.next(this.page$.value + 1);

    if (this.isLastPage) {
      this.shift$.next('+ 0rem');
    }
  }

  public toPreviousPage() {
    if (this.isFirstPage) return;
    this.page$.next(this.page$.value - 1);

    if (this.isFirstPage) {
      this.shift$.next('+ 0rem');
    }
  }

  public onSliderMouseEnter(next = false) {
    this.shift$.next(next ? `- ${this.itemWidth / 4}%` : `+ ${this.itemWidth / 4}%`);
  }

  public onSliderMouseLeave() {
    this.shift$.next('+ 0rem');
  }

  public onPlayClick(item: ICarouselItem) {
    this.itemStatus(item) === 'none' ?
      this._playerStore.startPlay(item.id)
      :
      this._playerStore.play();
  }

  public onStopClick() {
    this._playerStore.stop();
  }

  public getImageUrl(item: ICarouselItem) {
    switch (this.itemsType) {
      case "album":
        return {
          item: this._api.albumImageUrl(item.id),
          info: this._api.groupImageUrl(item.groupId as string)
        }
      case "track-list":
        return {
          item: this._api.trackListImageUrl(item.id),
          info: this._api.accountAvatarUrl(item.authorId as string)
        }
    }
  }

  public itemStatus(item: ICarouselItem): PlayTrackStatus {
    if (!this.playing(item)) return 'none';
    return this._playerStore.statuses.play;
  }

  public playing(item: ICarouselItem): boolean {
    return this._playerStore.isListPlaying(item.id, this.trackListType);
  }

  public get transform(): string {
    let itemsCount = this.itemsOnPage * this.page$.value;
    const missingItemsCount = this.itemsOnPage - (this.totalItems - this.page$.value * this.itemsOnPage);
    itemsCount = (this.isLastPage && !this.isFirstPage) ? (itemsCount - missingItemsCount) : itemsCount;
    return `translateX(calc(-${this.itemWidth + '%'} * ${itemsCount} ${this.shift$.value}))`;
  }

  public get pages(): number[] {
    return ArrayUtils.create(this.totalPages);
  }

  public get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsOnPage);
  }

  public get isFirstPage(): boolean {
    return this.page$.value === 0;
  }

  public get isLastPage(): boolean {
    return this.page$.value === (this.totalPages - 1);
  }

  public get itemWidth(): number {
    return 100 / this.itemsOnPage;
  }

  public get trackListType(): TrackListType {
    switch (this.itemsType) {
      case "album":
        return TrackListType.Album;
      case "track-list":
        return TrackListType.TrackList;
    }
  }

  private get _playerStore(): PlayerStore {
    return this._rootStore.playerStore;
  }

  private get _uiStore(): UiStore {
    return this._rootStore.uiStore;
  }

}
