export interface IRegistrationRequest {
  email: string;
  username: UniqueName;
  firstname?: string;
  lastname?: string;
  password: string;
}
