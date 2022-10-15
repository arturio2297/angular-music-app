import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'app-text-button',
  templateUrl: './text-button.component.html',
  styleUrls: ['./text-button.component.less']
})
export class TextButtonComponent {

  @Output()
  onClick = new EventEmitter<void>();

  @Input()
  text: string = '';

}
