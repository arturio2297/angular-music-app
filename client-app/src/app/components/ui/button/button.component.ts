import {Component, EventEmitter, Input, Output} from '@angular/core';

export type ButtonType = 'button' | 'reset' | 'submit';
export type ButtonVariant = 'main' | 'dark';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less']
})
export class ButtonComponent {

  @Output()
  onClick = new EventEmitter<void>();

  @Input()
  loading = false;

  @Input()
  disable = false;

  @Input()
  type: ButtonType = 'button';

  @Input()
  variant: ButtonVariant = 'main';

  public onButtonClick() {
    if (this.loading) return;
    this.onClick.emit();
  }

}
