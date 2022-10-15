export interface IErrorState {
  code?: ErrorCode;
  message: ErrorMessage;
}

export enum ScreenBD {
  SM = 576,
  MD = 768,
  LG = 992,
  XL = 1200,
  XXL = 1400,
}

export const screenBrakeDowns = Object.values(ScreenBD)
  .filter(x => typeof x === 'number') as number[];

export interface IUiStoreState {
  error: IErrorState | null;
  screenBD: ScreenBD | null;
}
