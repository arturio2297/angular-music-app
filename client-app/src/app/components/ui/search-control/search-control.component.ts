import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {BehaviorSubject} from "rxjs";

export type SearchEvent = { value: string };

export interface ISearchControlParams {
  delay: number;
  length: number;
}

@Component({
  selector: 'app-search-control',
  templateUrl: './search-control.component.html',
  styleUrls: ['./search-control.component.less']
})
export class SearchControlComponent {

  readonly showQueries$ = new BehaviorSubject(false);
  private _timerId: any;

  @Input()
  showAction: boolean;

  @Input()
  readonly: boolean;

  @Input()
  name = '';

  @Input()
  label: string;

  @Input()
  placeholder = '';

  @Input()
  warning: boolean;

  @Input()
  formGroupObj: FormGroup;

  @Input()
  formControlObj: FormControl;

  @Input()
  controlFormName: string;

  @Input()
  params: ISearchControlParams = { delay: 500, length: 2 };

  @Input()
  loading = false;

  @Input()
  searchQueries = [] as string[];

  @Output()
  onSearch = new EventEmitter<SearchEvent>();

  @Output()
  onCleared = new EventEmitter<void>();

  @Output()
  onRemoveQuery = new EventEmitter<string>();

  public onSearchQueryClick(value: string) {
    this.formControlObj.setValue(value);
    this.onSearch.emit({ value });
    this.showQueries$.next(false);
  }

  public onControlCleared() {
    this.onCleared.emit();
    this.showQueries$.next(false);
  }

  public onControlClick() {
    this.showQueries$.next(true);
  }

  public onControlKeyDown(event: any) {
    const code = (event.code as string).toLowerCase();
    switch (code) {
      case 'backspace':
        this.showQueries$.next(false);
        break;
    }
  }

  public onControlChange(value: string) {
    clearTimeout(this._timerId);
    if (value.length >= this.params.length) {
      this._timerId = setTimeout(() => {
        this.onControlSearch();
      }, this.params.delay);
    }
  }

  public onControlSearch() {
    if (!this.formControlObj.value) return;
    this.onSearch.emit({
      value: this.formControlObj.value
    });
    this.showQueries$.next(false);
  }

  public onControlFocus() {
    this.showQueries$.next(true);
  }

}
