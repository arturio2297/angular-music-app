import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.less']
})
export class RadioButtonComponent {

  @Input()
  checkedTitle = '';

  @Input()
  uncheckedTitle = '';

  @Input()
  checked: boolean;

  @Output()
  onChange = new EventEmitter<boolean>();

  public onButtonClick() {
    this.onChange.emit(!this.checked);
  }

  public get title(): string {
    return this.checked ? this.checkedTitle : this.uncheckedTitle;
  }

}
