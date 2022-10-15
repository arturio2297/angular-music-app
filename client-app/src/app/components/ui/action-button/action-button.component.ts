import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Size} from "../../../models/common/common.models";

export type ActionButtonType = 'add' | 'back' | 'next' | 'remove' | 'close' | 'dropdown' | 'update' | 'music-note'
  | 'play' | 'stop' | 'previous' | 'repeat' | 'repeat-1' | 'download' | 'like' | 'check' | 'plus' | 'refresh' | 'search'
  | 'sliders' | 'waves' | 'list-check'

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.less']
})
export class ActionButtonComponent {

  private readonly _defaultSize: Size<string> =  { width: '2.25rem', height: '2.25rem' };

  @Input()
  type: ActionButtonType = '' as ActionButtonType;

  @Output()
  onClick = new EventEmitter<void>();

  @Input()
  _size: Size<string | number> | null;

  constructor() { }

  public get size(): Size<string> {
    if (!this._size) return this._defaultSize;
    const width = typeof this._size.width === 'string' ? this._size.width : this._size.width + 'px';
    const height = typeof this._size.height === 'string' ? this._size.height : this._size.height + 'px';
    return { width, height };
  }

}
