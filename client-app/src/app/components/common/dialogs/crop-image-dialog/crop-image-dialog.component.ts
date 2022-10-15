import {Component, ViewChild} from '@angular/core';
import {CropImageService} from "../../../../services/crop.image.service";
import {ImageCroppedEvent, ImageCropperComponent} from "ngx-image-cropper";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-crop-image-dialog',
  templateUrl: './crop-image-dialog.component.html',
  styleUrls: ['./crop-image-dialog.component.less']
})
export class CropImageDialogComponent {

  @ViewChild(ImageCropperComponent) private _imageCropper: ImageCropperComponent;

  imageFile$ = new BehaviorSubject<File | null>(null);

  constructor(
    public cropImageService: CropImageService
  ) { }

  public onImageCropped(event: ImageCroppedEvent) {
    if (!this.imageFile$.value) return;

    this.cropImageService.onImageCropped(event, (this.imageFile$.value as File).name);
  }

  public close() {
    this.cropImageService.closeCrop();
    this.imageFile$.next(null);
  }

  public crop() {
    this._imageCropper.crop();
    this.imageFile$.next(null);
  }

  public removeImage() {
    this.imageFile$.next(null);
  }

  public get state() {
    return this.cropImageService.state$.getValue();
  }

}
