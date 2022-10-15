import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {ITrackListResponse, IUpdateTrackListRequest} from "../../../../../../models/api/track-lists.models";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RootStore} from "../../../../../../stores/root.store";
import {CropImageService} from "../../../../../../services/crop.image.service";
import {TracksStore} from "../../../../../../stores/tracks/tracks.store";
import {TrackListsStore} from "../../../../../../stores/track-lists/track-lists.store";
import {ITrackItem} from "../../../../../../models/api/track.models";
import AdditionalValidators from "../../../../../../validation/control.validators";
import {ImageControlValue} from "../../../../../../models/controls/control.models";
import {BehaviorSubject} from "rxjs";
import {ApiService} from "../../../../../../services/api/api.service";

export type EditTrackListFormEvent = { request: IUpdateTrackListRequest, image?: File };

type TrackStatus = 'removed' | 'added' | 'existed-added' | 'none';

@Component({
  selector: 'app-edit-track-list-form',
  templateUrl: './edit-track-list-form.component.html',
  styleUrls: ['../../../styles/track-list.form.styles.less']
})
export class EditTrackListFormComponent implements OnInit {

  @Output()
  onFormSubmit = new EventEmitter<EditTrackListFormEvent>();

  editForm = new FormGroup({
    name: new FormControl<UniqueName>(this.trackList.name, {
      validators: [Validators.required, Validators.maxLength(32)],
      asyncValidators: AdditionalValidators.checkTrackListExistsByName(
        name => this._trackListsStore.checkName(name, this.trackList.id)
      ),
      updateOn: 'blur'
    }),
    addedTracks: new FormControl<ITrackItem[]>([]),
    deletedTracks: new FormControl<ITrackItem[]>([]),
    image: new FormControl<ImageControlValue>(null)
  });

  searchForm = new FormGroup({
    searchTracks: new FormControl('')
  });

  warning$ = new BehaviorSubject(false);
  isExistedTracks$ = new BehaviorSubject(false);

  constructor(
    private _rootStore: RootStore,
    private _api: ApiService,
    private _cropImageService: CropImageService
  ) {
  }

  public onSubmit() {
    this.warning$.next(this.editForm.invalid);
    if (this.editForm.valid) {
      const {name, image} = this.editControls;

      const request: IUpdateTrackListRequest = {
        name: name.value as UniqueName,
        addedTracksIds: this._addedTracksIds,
        deletedTracksIds: this._deleteTracksIds
      };

      if (image.value) {
        request.image = { base64: image.value!.base64, filename: image.value!.filename }
      }

      this.onFormSubmit.emit({ request });
    }
  }

  public ngOnInit() {
    this._tracksStore.setFilterField(this.trackList.id, 'trackListId');
    this._tracksStore.setFilterField(this.trackList.id, 'notInTrackList');
    this.clearSearchResult();
  }

  public startCropImage() {
    this._cropImageService.startCrop(
      ((base64, filename) => this.editControls.image.setValue({ base64, filename }))
    );
  }

  public onScrollDown() {
    if (this._tracksStore.isLastPage) return;
    if (this.isExistedTracks$.value) {
      this._tracksStore.setTracksFor('track-list');
      this._tracksStore.fetchTracks({ fetchMore: true });
    } else {
      this._tracksStore.setTracksFor('all');
      this._tracksStore.fetchTracks({ fetchMore: true });
    }
  }

  public onTracksSearch(search: UniqueName) {
    this._tracksStore.setFilterField(search, 'search');
    this._tracksStore.setFilterField(this.trackList.id, 'notInTrackList');
    this._tracksStore.setFilterField('', 'trackListId');
    this._tracksStore.setTracksFor('all');
    this._tracksStore.refreshTracks(() => this.isExistedTracks$.next(false));
  }

  public getTrackStatus(item: ITrackItem): TrackStatus {
    if (this.isExistedTrack(item) && this._deleteTracksIds.includes(item.id)) return 'removed';
    if (this.isExistedTrack(item)) return 'existed-added';
    if (this._addedTracksIds.includes(item.id)) return 'added';
    return 'none';
  }

  public isExistedTrack(item: ITrackItem): boolean {
    return item.trackListId === this.trackList.id;
  }

  public onAddTrackItemClick(item: ITrackItem) {
    this._addTrack(item);
  }

  public onRemoveTrackItemClick(item: ITrackItem) {
    this._removeTrack(item);
  }

  public onCloseAddTrackItemClick(item: ITrackItem) {
    this._closeAddTrack(item);
  }

  public onCloseRemoveTrackItemClick(item: ITrackItem) {
    this._closeRemoveTrack(item);
  }

  public clearSearchResult() {
    this._tracksStore.clearTracksAndFilters();
    this._tracksStore.setTracksFor('track-list');
    this._tracksStore.setFilterField(this.trackList.id, 'trackListId');
    this._tracksStore.refreshTracks( () => this.isExistedTracks$.next(true));
  }

  private _addTrack(item: ITrackItem) {
    if (this._addedTracksIds.includes(item.id)) return;

    const addedTracks = [...this.addedTracks, item];
    this.editControls.addedTracks.setValue(addedTracks);
  }

  private _removeTrack(item: ITrackItem) {
    if (this._deleteTracksIds.includes(item.id)) return;

    const deletedTracks = [...this.deletedTracks, item];
    this.editControls.deletedTracks.setValue(deletedTracks);
  }

  private _closeAddTrack(item: ITrackItem) {
    if (!this._addedTracksIds.includes(item.id)) return;

    const addedTracks = [...this.addedTracks.filter(x => x.id !== item.id)];
    this.editControls.addedTracks.setValue(addedTracks);
  }

  private _closeRemoveTrack(item: ITrackItem) {
    if (!this._deleteTracksIds.includes(item.id)) return;

    const deletedTracks = [...this.deletedTracks.filter(x => x.id !== item.id)];
    this.editControls.deletedTracks.setValue(deletedTracks);
  }

  public onRemoveQuery(searchQuery: string) {
    this._tracksStore.removeSearchQuery(searchQuery);
  }

  public get imageUrl() {
    return this._api.trackListImageUrl(this.trackList.id);
  }

  public get searchQueries(): string[] {
    return this._tracksStore.searchQueries;
  }

  public get loading() {
    return {
      trackLists: this._trackListsStore.loading,
      tracks: this._tracksStore.loading
    };
  }

  public get filter() {
    return {
      trackLists: this._trackListsStore.filter,
      tracks: this._tracksStore.filter
    };
  }

  public get searchControls() {
    return this.searchForm.controls;
  }

  private get _deleteTracksIds(): ID[] {
    return this.deletedTracks.map(x => x.id);
  }

  private get _addedTracksIds(): ID[] {
    return this.addedTracks.map(x => x.id);
  }

  public get deletedTracks(): ITrackItem[] {
    return this.editControls.deletedTracks.value as ITrackItem[];
  }

  public get addedTracks(): ITrackItem[] {
    return this.editControls.addedTracks.value as ITrackItem[];
  }

  public get tracks(): ITrackItem[] {
    return this._tracksStore.tracks;
  }

  public get editControls() {
    return this.editForm.controls;
  }

  public get trackList(): ITrackListResponse {
    return this._trackListsStore.trackList as ITrackListResponse;
  }

  private get _tracksStore(): TracksStore {
    return this._rootStore.tracksStore;
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }
}
