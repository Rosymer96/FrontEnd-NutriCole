export interface IUser {
  id: number;
  name: string;
  email: string;
  rol: string;
}

export interface IUserRegister {
  name: string;
  email: string;
  password: string;
  dni: string;
}
