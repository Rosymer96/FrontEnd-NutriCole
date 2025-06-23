import { IUser } from './user';

export interface LoginResponse {
  message: string;
  token: string;
  user: IUser;
}
