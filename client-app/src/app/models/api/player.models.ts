import {ITrackItem, TrackListType} from "./track.models";

export interface IPlayerResponse {
  count: number;
  next: ITrackItem;
  current: ITrackItem;
  previous: ITrackItem;
  isFirst: boolean;
  isLast: boolean;
  listType: TrackListType;
}
