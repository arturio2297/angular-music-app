import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import ValidationUtils from "../../../utils/validation.utils";
import {ActionButtonType} from "../action-button/action-button.component";

export type ControlType = 'input' | 'textarea';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.less']
})
export class FormControlComponent {

  @Input()
  action?: ActionButtonType;

  @Input()
  placeholder = '';

  @Input()
  _showClear = false;

  @Output()
  onButtonClick = new EventEmitter<void>();

  @Output()
  onFocus = new EventEmitter<void>();

  @Output()
  onBlur = new EventEmitter<void>();

  @Output()
  onChange = new EventEmitter<string>();

  @Output()
  onCleared = new EventEmitter<void>();

  @Output()
  onKeyDown = new EventEmitter<any>();

  @Output()
  onClick = new EventEmitter<void>();

  @Input()
  label: string;

  @Input()
  autofocus = false;

  @Input()
  readonly = false;

  @Input()
  name: string;

  @Input()
  formGroupObj: FormGroup;

  @Input()
  formControlObj: FormControl;

  @Input()
  controlFormName: string; //formControlName props

  @Input()
  _type: string;

  @Input()
  warning = false;

  @Input()
  loading = false;

  @Input()
  validationMessagesOptions: Record<string, string>;

  @Input()
  controlType: ControlType = 'input';

  constructor() {
  }

  public onControlClick() {
    this.onClick.emit();
  }

  public onControlKeyDown(event: any) {
    this.onKeyDown.emit(event);
  }

  public onClear() {
    this.formControlObj.setValue('');
    this.onCleared.emit();
  }

  public onControlChange(event: any) {
    const value = event.target.value as string;
    this.onChange.emit(value);

    if (!value) {
      this.onCleared.emit();
    }
  }

  public onControlFocus() {
    this.onFocus.emit();
  }

  public onControlBlur() {
    this.onBlur.emit();
  }

  public get errors(): string[] {
    const {invalid, touched, errors} = this.formControlObj;
    if (invalid && errors && (touched || this.warning)) {
      return ValidationUtils.getMessages(errors, this.validationMessagesOptions);
    }
    return [];
  }

  public get isRequired(): boolean {
    return this.formControlObj.hasValidator(Validators.required);
  }

  public get type(): string {
    if (this._type) return this._type;
    if (this.name && this.name.toLowerCase().includes('password')) return 'password';
    return 'text';
  }

  public get showClear(): boolean {
    return this._showClear && !this.loading && this.formControlObj.value;
  }

}
