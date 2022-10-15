import {FileRequest} from "./coomon.models";

export enum UserRole {
  Admin = 'Admin',
  Moderator= 'Moderator',
  User = 'User'
}

export const userRoles: UserRole[] = [UserRole.Admin, UserRole.Moderator, UserRole.User];

export interface IAccountResponse {
  id: ID;
  email: string;
  username: UniqueName;
  firstname: string;
  lastname: string;
  role: UserRole;
}

export interface IUpdateAccountRequest {
  username: string;
  firstname: string;
  lastname: string;
  avatar?: FileRequest;
}
