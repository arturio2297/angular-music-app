import {IPageFilterParameters} from "./coomon.models";

export enum TrackListType {
  Group = 'Group',
  Album = 'Album',
  TrackList = 'TrackList'
}

export interface ITrackItem {
  id: ID;
  name: UniqueName;
  liked: boolean;
  likesCount: number;
  saved: boolean;
  filename: string;
  genre: UniqueName;
  albumName: UniqueName;
  albumId: ID;
  groupName: UniqueName;
  groupId: ID;
  listId: ID;
  trackListId?: ID;
  trackListName?: UniqueName;
  order?: number;
}

export interface IAddTrackRequest {
  name: UniqueName;
  genre: UniqueName;
  albumId: ID;
}

export interface IUpdateTrackRequest {
  name: UniqueName;
  genre: UniqueName;
  albumId: ID;
}

export interface ITrackFilterParameters extends IPageFilterParameters {
  search?: string;
  groupId?: ID;
  albumId?: ID;
  trackListId?: ID;
  notInGroup?: ID;
  notInAlbum?: ID;
  notInTrackList?: ID;
}

export interface ITracksTrackListFilterParameters extends IPageFilterParameters {
  search?: string;
  trackListId: ID;
}

export interface ITracksGroupFilterParameters extends IPageFilterParameters {
  search?: string;
  groupId: ID;
}

export interface ITracksAlbumFilterParameters extends IPageFilterParameters {
  search?: string;
  albumId: ID;
}

export interface IUserTracksFilterParameters extends IPageFilterParameters {
  search?: string;
}


