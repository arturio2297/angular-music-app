import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {ToastsService} from "../../../services/toasts.service";
import {Action} from "../../../models/common/common.models";
import {IconNamesEnum} from "ngx-bootstrap-icons";

export type DropZoneType = 'image' | 'audio';

const iconNames: Record<DropZoneType, string> = {
  image: 'image-fill',
  audio: 'music-note'
}

@Component({
  selector: 'app-drop-zone',
  templateUrl: './drop-zone.component.html',
  styleUrls: ['./drop-zone.component.less']
})
export class DropZoneComponent {

  @ViewChild('fileForm') private _fileForm: ElementRef<HTMLFormElement>;
  @ViewChild('fileInput') private _fileInput: ElementRef<HTMLInputElement>;

  @Output()
  onFileChange = new EventEmitter<File>();

  @Input()
  type: DropZoneType = 'image';

  constructor(private _toastsService: ToastsService) {
  }

  public onFileDropped(file: File) {
    this._checkFormat(file.name, () => this.onFileChange.emit(file));
  }

  public onFileInputChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0] as File;
      this._checkFormat(file.name, () => this.onFileChange.emit(file));
    }
    this._fileForm.nativeElement.reset();
  }

  public onDropZoneClick() {
    this._fileInput.nativeElement.click();
  }

  private _checkFormat(filename: string, onSuccess: Action) {
    const split = filename.split('.');
    const type = split[split.length - 1];
    const formats = this.acceptFormats.map(x => x.replace('.', ''));
    if (formats.includes(type)) {
      onSuccess();
    } else {
      this._toastsService.push(
        `File format "${type}" is not supported. Supported image formats is: ${formats.join(', ')}`,
        'warning'
      );
    }
  }

  public get acceptFormats(): string[] {
    switch (this.type) {
      case 'image':
        return ['.png', '.jpeg', '.jpg', '.bmp'];
      case 'audio':
        return ['.mp3'];
      default:
        return [];
    }
  }

  public get iconName(): IconNamesEnum {
    return iconNames[this.type] as IconNamesEnum;
  }



}
