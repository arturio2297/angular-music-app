import {FileRequest, IPageFilterParameters} from "./coomon.models";
import {ITrackItem} from "./track.models";

export interface IAlbumItem {
  id: ID;
  name: UniqueName;
  liked: boolean;
  likesCount: number;
  saved: boolean;
  releasedAt: DateString;
  groupName: UniqueName;
  groupId: ID;
  listening: number;
  tracksCount: number;
  tracks: ITrackItem[];
}

export interface IAlbumResponse {
  id: ID;
  name: UniqueName;
  liked: boolean;
  likesCount: number;
  saved: boolean;
  releasedAt: DateString;
  groupId: ID;
  groupName: UniqueName;
  genres: UniqueName[];
  listening: number;
  tracksCount: number;
}

export interface IAddAlbumRequest {
  name: UniqueName;
  releasedAt: DateString;
  groupId: ID;
  image?: FileRequest;
}

export interface IUpdateAlbumRequest {
  name: UniqueName;
  releasedAt: DateString;
  groupId: ID;
  image?: FileRequest;
}

export interface IAlbumsFilterParameters extends IPageFilterParameters {
  search?: string;
  groupId?: ID;
  tracksCount?: number;
}

export interface IUserAlbumsFilterParameters extends IPageFilterParameters {
  search?: string;
  groupId?: ID;
}
