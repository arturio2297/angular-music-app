import {Component, Input} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-image',
  templateUrl: './image-component.html',
  styleUrls: ['./image-component.less']
})
export class ImageComponent {

  error$ = new BehaviorSubject(false);

  @Input()
  imageClass: string;

  @Input()
  alt = 'some image'

  @Input()
  _src = '';

  @Input()
  _fallback = '';

  public onError(error: any) {
    this.error$.next(true);
  }

  public get src() {
    return this.error$.value ? this._fallback : this._src;
  }

}
