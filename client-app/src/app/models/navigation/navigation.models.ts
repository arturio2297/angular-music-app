import {UserRole, userRoles} from "../api/account.models";

export interface IApplicationUrl {
  value: string;
  title: string;
  acceptRoles: UserRole[];
  isOnlyPublic?: boolean;
  isNavigation?: boolean;
  parentValue?: string;
}

const login: IApplicationUrl = {
  value: 'login',
  title: 'Login',
  acceptRoles: [],
  isOnlyPublic: true
}

const registration: IApplicationUrl = {
  value: 'registration',
  title: 'Registration',
  acceptRoles: [],
  isOnlyPublic: true
}

const me: IApplicationUrl = {
  value: 'me',
  title: 'Your music',
  acceptRoles: userRoles,
  isNavigation: true
}

const meMain: IApplicationUrl = {
  value: 'main',
  title: 'Main',
  acceptRoles: userRoles,
  parentValue: 'me'
}

const meTracks: IApplicationUrl = {
  value: 'tracks',
  title: 'My playlist',
  acceptRoles: userRoles,
  parentValue: me.value
}

const meAlbums: IApplicationUrl = {
  value: 'albums',
  title: 'My albums',
  acceptRoles: userRoles,
  parentValue: me.value
}

const meTrackLists: IApplicationUrl = {
  value: 'track-lists',
  title: 'My track lists',
  acceptRoles: userRoles,
  parentValue: me.value
}

const groups: IApplicationUrl = {
  value: 'groups',
  title: 'Music groups',
  acceptRoles: userRoles,
  isNavigation: true
}

const groupDetails: IApplicationUrl = {
  value: 'groups/details/:id/view',
  title: 'Group',
  acceptRoles: userRoles
}

const groupAlbums: IApplicationUrl = {
  value: 'albums',
  title: 'Group albums',
  acceptRoles: userRoles,
  parentValue: groupDetails.value
}

const groupTracks: IApplicationUrl = {
  value: 'tracks',
  title: 'Group tracks',
  acceptRoles: userRoles,
  parentValue: groupDetails.value
}

const createGroup: IApplicationUrl = {
  value: 'groups/details/create',
  title: 'Create New Group',
  acceptRoles: [UserRole.Admin, UserRole.Moderator]
}

const editGroup: IApplicationUrl = {
  value: 'groups/details/:id/edit',
  title: 'Edit Group',
  acceptRoles: [UserRole.Admin, UserRole.Moderator]
}

const albums: IApplicationUrl = {
  value: 'albums',
  title: 'Music albums',
  acceptRoles: userRoles,
  isNavigation: true
}

const albumDetails: IApplicationUrl = {
  value: 'albums/details/:id/view',
  title: 'Album',
  acceptRoles: userRoles
}

const createAlbum: IApplicationUrl = {
  value: 'albums/details/create',
  title: 'Create New Album',
  acceptRoles: [UserRole.Admin, UserRole.Moderator]
}

const editAlbum: IApplicationUrl = {
  value: 'albums/details/:id/edit',
  title: 'Edit Album',
  acceptRoles: [UserRole.Admin, UserRole.Moderator]
}

const trackLists: IApplicationUrl = {
  value: 'track-lists',
  title: 'Track lists',
  acceptRoles: userRoles,
  isNavigation: true
}

const trackListDetails: IApplicationUrl = {
  value: 'track-lists/details/:id/view',
  title: 'Track list',
  acceptRoles: userRoles
}

const createTrackList: IApplicationUrl = {
  value: 'track-lists/details/create',
  title: 'Create New Track List',
  acceptRoles: userRoles
}

const editTrackList: IApplicationUrl = {
  value: 'track-lists/details/:id/edit',
  title: 'Edit Track List',
  acceptRoles: userRoles
}

const account: IApplicationUrl = {
  value: 'account',
  title: 'Account',
  acceptRoles: userRoles
}

export type ApplicationUrlKey =
  'login' |
  'registration' |
  'me' | 'meMain' | 'meTracks' | 'meAlbums' | 'meTrackLists' |
  'groups' | 'groupDetails' | 'groupAlbums' | 'groupTracks' | 'createGroup' | 'editGroup' |
  'albums' | 'albumDetails' | 'createAlbum' | 'editAlbum' |
  'trackLists' | 'trackListDetails' | 'createTrackList' | 'editTrackList' |
  'account'

export type ApplicationUrls = Record<ApplicationUrlKey, IApplicationUrl>;

const applicationUrls: ApplicationUrls = {
  registration,
  login,
  me,
  meMain,
  meTracks,
  meAlbums,
  meTrackLists,
  groups,
  groupDetails,
  groupAlbums,
  groupTracks,
  createGroup,
  editGroup,
  albums,
  albumDetails,
  createAlbum,
  editAlbum,
  trackLists,
  trackListDetails,
  createTrackList,
  editTrackList,
  account
}

export default applicationUrls;
