export enum GrantType {
  Password = 'password',
  RefreshToken = 'refresh_token'
}

export interface ITokenRequest {
  GrantType: GrantType
  password: string;
  email: string;
  refresh_token: string;
}

export interface ITokenResponse {
  access_token: string;
  access_expires_at: DateString;
  refresh_token: string;
  refresh_expires_at: DateString;
}
