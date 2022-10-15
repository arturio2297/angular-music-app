import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {noOp} from "../models/common/common.models";
import {ImageCroppedEvent} from "ngx-image-cropper";

export type OnImageCropped = (base64: Base64, filename: string) => void;
export type CropImageFormats = 'png' | 'bmp' | 'jpeg' | 'jpg'

export interface IStartCropOptions {
  aspectRatio: number;
  format: CropImageFormats;
  headerTitle: string;
}

interface ICropImageServiceState extends IStartCropOptions {
  start: boolean;
  onImageCropped: OnImageCropped;
  headerTitle: string;
}

const initialState: ICropImageServiceState = {
  start: false,
  aspectRatio: 1,
  format: 'png',
  onImageCropped: noOp,
  headerTitle: 'Crop image'
};

@Injectable({
  providedIn: 'root'
})
export class CropImageService {

  readonly state$ = new BehaviorSubject<ICropImageServiceState>(initialState);

  public startCrop(onImageCropped: OnImageCropped, options = {} as IStartCropOptions) {
    this.state$.next({
      ...this.state$.value,
      ...options,
      start: true,
      onImageCropped
    });
  }

  public closeCrop() {
    this.state$.next(initialState);
  }

  public onImageCropped(event: ImageCroppedEvent, filename: string) {
    event.base64 && this.state$.value.onImageCropped(event.base64, filename);
    this.state$.next(initialState);
  }

}
