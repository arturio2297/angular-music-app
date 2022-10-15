import {Component, OnInit} from "@angular/core";
import {RootStore} from "../../../../stores/root.store";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FileControlValue} from "../../../../models/controls/control.models";
import AdditionalValidators from "../../../../validation/control.validators";
import {BehaviorSubject} from "rxjs";
import {IAddTrackRequest} from "../../../../models/api/track.models";
import {ToastsService} from "../../../../services/toasts.service";
import {IGenreItem} from "../../../../models/api/genres.models";
import {IAddTrackDialogData} from "src/app/models/store/tracks.store.models";
import {TracksStore} from "../../../../stores/tracks/tracks.store";
import {GenresStore} from "../../../../stores/genres/genres.store";

@Component({
  selector: 'app-add-track-dialog',
  templateUrl: './add-track-dialog.component.html',
  styleUrls: ['./add-track-dialog.component.less']
})
export class AddTrackDialogComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl<UniqueName>('', {
      validators: Validators.required,
      asyncValidators: AdditionalValidators.checkTrackExistsByName(
        name => this._tracksStore.checkName(name, this.dialogData.albumId)
      ),
      updateOn: 'blur'
    }),
    genre: new FormControl<UniqueName>('', Validators.required),
    genreSearch: new FormControl<string>('', {
      updateOn: 'change'
    }),
    audio: new FormControl<FileControlValue>(null)
  }, {
    validators: AdditionalValidators.audioRequired('audio'),
    updateOn: 'submit'
  });

  warning$ = new BehaviorSubject(false);
  genresNotFound$ = new BehaviorSubject(false);

  constructor(
    private _rootStore: RootStore,
    private _toastsService: ToastsService
  ) {
  }

  public ngOnInit() {
    this._genresStore.clearGenresAndFilters();
  }

  public onClose() {
    this._tracksStore.setDialogField(null, 'addTrack');
  }

  public onSubmit() {
    this.warning$.next(this.form.invalid);
    if (this.form.valid) {
      const {name, genre, audio} = this.controls;

      const request: IAddTrackRequest = {
        name: name.value as UniqueName,
        genre: genre.value as UniqueName,
        albumId: this.dialogData.albumId
      };

      this._tracksStore.addTrack(
        request,
        audio.value as File,
        () => {
          this.dialogData.onSuccess && this.dialogData.onSuccess();
          this._toastsService.push('Track successfully added to album', 'success');
          this.onClose();
        },
        () => {
          this.dialogData.onFail && this.dialogData.onFail();
        }
      );
    }
  }

  public onAudioChange(audio: File) {
    this.controls.audio.setValue(audio);
  }

  public onGenresSearch(name: string) {
    this._genresStore.setFilterField(name, 'search');
    this._genresStore.fetchGenres(
      x => this.genresNotFound$.next(!x.length),
      () => this.genresNotFound$.next(false)
    );
  }

  public onGenreItemClick(name: UniqueName) {
    this.controls.genre.setValue(name);
    this.controls.genreSearch.setValue('');
    this.clearSearchResult();
  }

  public clearSearchResult() {
    this._genresStore.clearGenres();
    this.genresNotFound$.next(true);
  }

  public onGenreCleared() {
    this.controls.genre.setValue('');
  }

  public get genres(): IGenreItem[] {
    return this._genresStore.genres.filter(x => x.name !== this.controls.genre.value);
  }

  public get loading() {
    return {
      tracks: this._tracksStore.loading,
      genres: this._genresStore.loading
    };
  }

  public get controls() {
    return this.form.controls;
  }

  public get dialogData(): IAddTrackDialogData {
    return this._tracksStore.dialog.addTrack as IAddTrackDialogData;
  }

  private get _tracksStore(): TracksStore {
    return this._rootStore.tracksStore;
  }

  private get _genresStore(): GenresStore {
    return this._rootStore.genresStore;
  }

}
