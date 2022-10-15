import {FileRequest, IPageFilterParameters} from "./coomon.models";
import {ITrackItem} from "./track.models";

export interface IGroupItem {
  id: ID;
  name: UniqueName;
  tracks: ITrackItem[];
  albumsCount: number;
}

export interface IGroupResponse {
  id: ID;
  name: UniqueName;
  additionalInfo: string;
  genres: string[];
  albumsCount: number;
}

export interface IAddGroupRequest {
  name: UniqueName;
  additionalInfo?: string;
  image?: FileRequest;
}

export interface IUpdateGroupRequest {
  name: UniqueName;
  additionalInfo?: string;
  image?: FileRequest;
}

export interface IGroupsFilterParameters extends IPageFilterParameters {
  search?: string;
  tracksCount?: number;
}
