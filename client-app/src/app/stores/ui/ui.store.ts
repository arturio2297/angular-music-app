import {ChangeState, IStore} from "../../models/store/store.models";
import {BehaviorSubject, map, Observable} from "rxjs";
import {NavigationService} from "../../services/navigation.service";
import {ToastsService} from "../../services/toasts.service";
import {IErrorState, IUiStoreState, ScreenBD} from "../../models/store/ui.store.models";

export type ChangeUiStoreState = ChangeState<IUiStoreState>;

export class UiStore implements IStore<IUiStoreState>{

  readonly state$ = new BehaviorSubject({} as IUiStoreState);
  private readonly _appContainerId = 'app-container';

  constructor(
    state$: Observable<IUiStoreState>,
    private _changeState: ChangeUiStoreState,
    private _navigationStore: NavigationService,
    private _toastsService: ToastsService
  ) {
    state$.subscribe(x => this.state$.next(x));
  }

  public setScreenBD(screenBD: ScreenBD | null) {
    this._changeState({...this.state$.value, screenBD});
  }

  public setError(error: IErrorState) {
    this._toastsService.push(`Error: ${error.message}`, 'danger');
    this._changeState({ ...this.state$.value, error });
  }

  public clearError() {
    this._changeState({ ...this.state$.value, error: null });
  }

  public getAppContainer(): HTMLElement {
    return document.getElementById(this._appContainerId) as HTMLElement;
  }

  public get error$(): Observable<IErrorState | null> {
    return this.state$.asObservable().pipe(map(x => x.error));
  }

  public get screenBD$(): Observable<ScreenBD | null> {
    return this.state$.asObservable().pipe(map(x => x.screenBD));
  }

}
