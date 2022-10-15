import {Directive, EventEmitter, HostBinding, HostListener, Output} from "@angular/core";

@Directive({
  selector: '[dropZone]'
})
export class DropDirective {

  @HostBinding('class.file-over') fileOver: boolean;

  @Output()
  fileDropped = new EventEmitter<File>();

  @HostListener('dragover', ['$event'])
  public onDragOver(ev: any) {
    ev.preventDefault();
    ev.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(ev: any) {
    ev.preventDefault();
    ev.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event'])
  public onDrop(ev: any) {
    ev.preventDefault();
    ev.stopPropagation();
    this.fileOver = false;
    const files = ev.dataTransfer.files;
    if (files && files.length) {
      this.fileDropped.emit(files[0]);
    }
  }

}
