import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {AlertType} from "../components/ui/alert/alert.component";

export type ToastType = AlertType;

export class Toast {

  private _timerId: any;
  private readonly _delay = 50
  private readonly _animationRespite = 250;
  private readonly _time$ = new BehaviorSubject(0);
  private readonly _closed$ = new BehaviorSubject(false);

  constructor(
    public type: ToastType,
    public content: string,
    public destroy: (toast: Toast) => void,
    private _lifetime = 5000
  ) {
    this.startTimer();
  }

  public close() {
    this.stopTimer();
    this._closed$.next(true);
    setTimeout(() => this.destroy(this), this._animationRespite);
  }

  public stopTimer() {
    clearTimeout(this._timerId);
  }

  public startTimer() {
    this.stopTimer();
    this._timerId = setInterval(() => {

      this._time$.next(this._time + this._delay);

      if (this._time >= this._lifetime)
        this.close();

    }, this._delay);
  }

  private get _time(): number {
    return this._time$.value;
  }

  public get closed(): boolean {
    return this._closed$.getValue();
  }

  public get lifePercent(): number {
    return (this._time / this._lifetime) * 100;
  }

}

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  private readonly _toasts$ = new BehaviorSubject([] as Toast[]);

  constructor() {
  }

  public push(content: string, type: ToastType = 'info') {
    const toast = new Toast(
      type,
      content,
      x => this._removeToast(x)
    );
    this._toasts$.next([toast, ...this._toasts$.value])
  }

  public clear() {
    this._toasts$.value.forEach(x => x.destroy(x));
  }

  private _removeToast(toast: Toast) {
    this._toasts$.next(this._toasts$.value.filter(x => x !== toast));
  }

  public get toasts(): Toast[] {
    return this._toasts$.getValue();
  }

}
