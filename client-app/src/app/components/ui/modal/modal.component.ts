import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less']
})
export class ModalComponent implements OnInit {

  @Output()
  private _onClose = new EventEmitter<void>();
  closed$ = new BehaviorSubject(false);
  modalHover$ = new BehaviorSubject(false);

  constructor() { }

  ngOnInit(): void {
  }

  public close() {
    this.closed$.next(true);
    setTimeout(() => this._onClose.emit(), 200);
  }

  public onBgClick() {
    !this.modalHover$.value && this.close();
  }

}
