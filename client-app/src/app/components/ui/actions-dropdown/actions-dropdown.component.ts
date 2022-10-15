import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ActionButtonType} from "../action-button/action-button.component";
import {Size} from "../../../models/common/common.models";
import {HintPosition} from "../hint/hint.component";

export interface IDropdownActionItem {
  name: ActionButtonType,
  size?: Size<string | number>,
  hide?: boolean,
  hint?: {
    content: string;
    position?: HintPosition;
  }
}

@Component({
  selector: 'app-actions-dropdown',
  templateUrl: './actions-dropdown.component.html',
  styleUrls: ['./actions-dropdown.component.less']
})
export class ActionsDropdownComponent {

  @Input()
  _items: IDropdownActionItem[] = [];

  @Output()
  onActionsClick = new EventEmitter<ActionButtonType>();

  constructor() {
  }

  public get items(): IDropdownActionItem[] {
    return this._items.filter(x => !x.hide);
  }

}
