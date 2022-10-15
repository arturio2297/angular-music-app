import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {IAddTrackListRequest} from "../../../../../../models/api/track-lists.models";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import AdditionalValidators from "../../../../../../validation/control.validators";
import {RootStore} from "../../../../../../stores/root.store";
import {TrackListsStore} from "../../../../../../stores/track-lists/track-lists.store";
import {ImageControlValue} from "../../../../../../models/controls/control.models";
import {BehaviorSubject} from "rxjs";
import {ITrackItem} from "../../../../../../models/api/track.models";
import {CropImageService} from "../../../../../../services/crop.image.service";
import {TracksStore} from "../../../../../../stores/tracks/tracks.store";

export type CreateTrackListFormEvent = { request: IAddTrackListRequest, image?: File };

@Component({
  selector: 'app-create-track-list-form',
  templateUrl: './create-track-list-form.component.html',
  styleUrls: ['../../../styles/track-list.form.styles.less']
})
export class CreateTrackListFormComponent implements OnInit {

  @Output()
  onFormSubmit = new EventEmitter<CreateTrackListFormEvent>();

  createForm = new FormGroup({
    name: new FormControl<UniqueName>('', {
      validators: [Validators.required, Validators.maxLength(32)],
      asyncValidators: AdditionalValidators.checkTrackListExistsByName(
        name => this._trackListsStore.checkName(name)
      ),
      updateOn: 'blur'
    }),
    tracks: new FormControl<ITrackItem[]>([]),
    image: new FormControl<ImageControlValue>(null)
  });

  searchForm = new FormGroup({
    searchTracks: new FormControl('')
  });

  warning$ = new BehaviorSubject(false);

  constructor(
    private _rootStore: RootStore,
    private _cropImageService: CropImageService
  ) {
  }

  public ngOnInit() {
    this._tracksStore.clearTracksAndFilters();
    this._tracksStore.setTracksFor('all');
  }

  public onSubmit() {
    this.warning$.next(this.createForm.invalid);
    if (this.createForm.valid) {
      const {name, image} = this.createControls;

      const request: IAddTrackListRequest = {
        name: name.value as UniqueName,
        addedTracksIds: this._addedTracksIds
      };

      if (image.value) {
        request.image = {base64: image.value!.base64, filename: image.value!.filename};
      }

      this.onFormSubmit.emit({request});
    }
  }

  public startCropImage() {
    this._cropImageService.startCrop(
      (base64, filename) => this.createControls.image.setValue({base64, filename})
    );
  }

  public onScrollDown() {
    if (this._tracksStore.isLastPage) return;
    this._tracksStore.fetchTracks({fetchMore: true});
  }

  public onTracksSearch(search: UniqueName) {
    this._tracksStore.setFilterField(search, 'search');
    this._tracksStore.refreshTracks();
  }

  public isTrackAdded(item: ITrackItem): boolean {
    return this._addedTracksIds.includes(item.id);
  }

  public onAddTrackItemClick(item: ITrackItem) {
    this._addTrack(item);
  }

  public onRemoveTrackItemClick(item: ITrackItem) {
    this._removeTrack(item);
  }

  public clearSearchResult() {
    this._tracksStore.clearTracksAndFilters();
  }

  private _addTrack(item: ITrackItem) {
    if (this._addedTracksIds.includes(item.id)) return;

    const tracks = [...this.addedTracks, item];
    this.createControls.tracks.setValue(tracks);
  }

  private _removeTrack(item: ITrackItem) {
    const tracks = [...this.addedTracks.filter(x => x.id !== item.id)];
    this.createControls.tracks.setValue(tracks);
  }

  public onRemoveQuery(searchQuery: string) {
    this._tracksStore.removeSearchQuery(searchQuery);
  }

  public get imageUrl() {
    return this.createControls.image.value?.base64;
  }

  public get loading() {
    return {
      trackLists: this._trackListsStore.loading,
      tracks: this._tracksStore.loading
    };
  }

  public get searchQueries(): string[] {
    return this._tracksStore.searchQueries;
  }

  public get filter() {
    return this._tracksStore.filter;
  }

  public get searchControls() {
    return this.searchForm.controls;
  }

  private get _addedTracksIds(): ID[] {
    return this.addedTracks.map(x => x.id);
  }

  public get addedTracks(): ITrackItem[] {
    return this.createControls.tracks.value as ITrackItem[];
  }

  public get tracks(): ITrackItem[] {
    return this._tracksStore.tracks;
  }

  public get createControls() {
    return this.createForm.controls;
  }

  private get _tracksStore(): TracksStore {
    return this._rootStore.tracksStore;
  }

  private get _trackListsStore(): TrackListsStore {
    return this._rootStore.trackListsStore;
  }

}
