import {TrackListType} from "../api/track.models";
import {LoadingState} from "./store.models";
import {IPlayerResponse} from "../api/player.models";

export type PlayerStoreLoadingField = 'fetchTrack';
export type PlayerStoreLoadingState = LoadingState<PlayerStoreLoadingField>;

export enum EqualizerFrequency {
  _60 = 60,
  _170 = 170,
  _310 = 310,
  _600 = 600,
  _1000 = 1000,
  _3000 = 3000,
  _6000 = 6000,
  _12000 = 12000,
  _14000 = 14000,
  _16000 = 16000
}

export interface IEqualizerGain {
  value: number;
  frequency: EqualizerFrequency;
}

export const equalizerFrequencies = Object.values(EqualizerFrequency).filter(x => typeof x === 'number') as number[];

export interface IPlayerTime {
  currentTime: number;
  duration: number;
}

export type PlayTrackStatus = 'play' | 'stop' | 'none';
export type RepeatTrackStatus = 'track' | 'track-list' | 'none';

export interface IPlayerStatuses {
  play: PlayTrackStatus,
  repeat: RepeatTrackStatus
}

export interface IPlayerListState {
  id: ID;
  type: TrackListType;
}

export interface IEqualizerSettings {
  name: UniqueName;
  gains: IEqualizerGain[];
}

export interface IPlayerEqualizerState {
  on: boolean;
  settings: IEqualizerSettings[];
  selectedSettingsName: UniqueName;
}

export interface IPlayerStoreVisualiserState {
  color: string;
}

export interface IAudioPlayerStoreState {
  loading: PlayerStoreLoadingState;
  list: IPlayerListState | null;
  tracks: IPlayerResponse | null;
  time: IPlayerTime;
  statuses: {
    repeat: RepeatTrackStatus;
    play: PlayTrackStatus;
  };
  equalizer: IPlayerEqualizerState;
  visualiser: IPlayerStoreVisualiserState;
  volume: number;
}
