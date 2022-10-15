import {FileRequest, IPageFilterParameters, SortOrder} from "./coomon.models";
import {ITrackItem} from "./track.models";

export interface ITrackListItem {
  id: ID;
  name: UniqueName;
  authorId: ID;
  liked: boolean;
  likesCount: number;
  saved: boolean;
  listening: number;
  tracks: ITrackItem[];
  tracksCount: number;
}

export interface ITrackListResponse {
  id: ID;
  name: UniqueName;
  genres: UniqueName[];
  authorId: ID;
  liked: boolean;
  likesCount: number;
  saved: boolean;
  listening: number;
  tracksCount: number;
}

export interface IAddTrackListRequest {
  name: UniqueName;
  image?: FileRequest;
  addedTracksIds: ID[];
}

export interface IUpdateTrackListRequest {
  name: UniqueName;
  image?: FileRequest;
  addedTracksIds: ID[];
  deletedTracksIds: ID[];
}

export type TrackListSortField = keyof ITrackListItem;

export interface ITrackListsFilterParameters extends IPageFilterParameters {
  search?: string;
  authorId?: ID;
  author?: UniqueName;
  tracksCount?: number;
  sort?: TrackListSortField;
  order?: SortOrder;
}

export interface IUserTrackListsFilterParameters extends IPageFilterParameters {
  search?: string;
  authorId?: ID;
  userId?: ID;
}
