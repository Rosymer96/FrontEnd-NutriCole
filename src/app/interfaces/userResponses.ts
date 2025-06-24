import { IUser } from './user';

export interface LoginResponse {
  message: string;
  token: string;
  user: IUser;
}

export interface RegisterResponse {
  message: string;
  newTutorId: number;
}
