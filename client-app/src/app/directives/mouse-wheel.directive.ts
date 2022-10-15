import {Directive, EventEmitter, HostListener, Output} from "@angular/core";

@Directive({
  selector: '[mouseWheel]'
})
export class MouseWheelDirective {

  @Output()
  onWheelUp = new EventEmitter<void>();

  @Output()
  onWheelDown = new EventEmitter<void>();


  @HostListener('mousewheel', ['$event'])
  public onMouseWheel(event: any) {
    event.deltaY < 0 ?
      this.onWheelUp.emit()
      :
      this.onWheelDown.emit();
  }

}
