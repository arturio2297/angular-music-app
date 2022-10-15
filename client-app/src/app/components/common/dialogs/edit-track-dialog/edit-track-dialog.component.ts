import {Component} from "@angular/core";
import {RootStore} from "../../../../stores/root.store";
import {IEditDialogData} from "../../../../models/store/store.models";
import {ITrackItem, IUpdateTrackRequest} from "../../../../models/api/track.models";
import {ToastsService} from "../../../../services/toasts.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import AdditionalValidators from "../../../../validation/control.validators";
import {BehaviorSubject} from "rxjs";
import {IGenreItem} from "../../../../models/api/genres.models";
import {TracksStore} from "../../../../stores/tracks/tracks.store";
import {GenresStore} from "../../../../stores/genres/genres.store";

@Component({
  selector: 'app-edit-track-dialog',
  templateUrl: './edit-track-dialog.component.html',
  styleUrls: ['./edit-track-dialog.component.less']
})
export class EditTrackDialogComponent {

  form = new FormGroup({
    name: new FormControl<UniqueName>(this.track.name, {
      validators: Validators.required,
      asyncValidators: AdditionalValidators.checkTrackExistsByName(
        name => this._tracksStore.checkName(name, this.track.albumId, this.track.id)
      ),
      updateOn: 'blur'
    }),
    genre: new FormControl<UniqueName>(this.track.genre, Validators.required),
    genreSearch: new FormControl<string>('', {
      updateOn: 'change'
    })
  })

  warning$ = new BehaviorSubject(false);
  genresNotFound$ = new BehaviorSubject(false);

  constructor(
    private _rootStore: RootStore,
    private _toastsService: ToastsService
  ) {
  }

  public onClose() {
    this._tracksStore.setDialogField(null, 'updateTrack');
  }

  public onSubmit() {
    this.warning$.next(this.form.invalid);
    if (this.form.valid) {
      const {name, genre} = this.controls;

      const request: IUpdateTrackRequest = {
        name: name.value as UniqueName,
        genre: genre.value as UniqueName,
        albumId: this.track.albumId
      };

      this._tracksStore.updateTrack(
        this.track.id,
        request,
        undefined,
        () => {
          this._toastsService.push('Track successfully updated', 'success');
          this.trackData.onSuccess && this.trackData.onSuccess();
          this.onClose();
        },
        () => {
          this.trackData.onFail && this.trackData.onFail();
        }
      );
    }
  }

  public onGenresSearch(name: string) {
    this._genresStore.setFilterField(name, 'search');
    this._genresStore.fetchGenres(
      x => this.genresNotFound$.next(!x.length),
      () => this.genresNotFound$.next(true)
    );
  }

  public onGenreItemClick(name: UniqueName) {
    this.controls.genre.setValue(name);
    this.controls.genreSearch.setValue('');
    this.clearSearchResult();
  }

  public clearSearchResult() {
    this._genresStore.clearGenres();
    this.genresNotFound$.next(false);
  }

  public onGenreCleared() {
    this.controls.genreSearch.setValue('');
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

  public get track(): ITrackItem {
    return this.trackData.item;
  }

  public get trackData(): IEditDialogData<ITrackItem> {
    return this._tracksStore.dialog.updateTrack as IEditDialogData<ITrackItem>;
  }

  private get _tracksStore(): TracksStore {
    return this._rootStore.tracksStore;
  }

  private get _genresStore(): GenresStore {
    return this._rootStore.genresStore;
  }

}
