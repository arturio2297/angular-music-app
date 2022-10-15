import {Component, EventEmitter, Input, Output} from '@angular/core';

export interface IDropdownListItem {
  name: string;
}
@Component({
  selector: 'app-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.less']
})
export class DropdownListComponent<T extends IDropdownListItem> {

  constructor() { }

  @Output()
  onItemClick = new EventEmitter<T>();

  @Output()
  onValueClick = new EventEmitter<string>();

  @Output()
  onItemActionClick = new EventEmitter<T>();

  @Output()
  onValueActionClick = new EventEmitter<string>();

  @Output()
  onClose = new EventEmitter<void>();

  @Input()
  showClose = false;

  @Input()
  itemAction: string;

  @Input()
  items: T[] = [];

  @Input()
  values: string[] = [];

  public onElementClick(element: T | string) {
    typeof element === 'object' ? this.onItemClick.emit(element) : this.onValueClick.emit(element);
  }

  public onElementActionClick(element: T | string) {
    typeof element === 'object' ? this.onItemActionClick.emit(element) : this.onValueActionClick.emit(element);
  }

}
