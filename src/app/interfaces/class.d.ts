export interface ClassResponse {
  success: string;
  data: IClass[];
}

export interface IClass {
  idClass: number;
  name: string;
}
export interface AddClassResponse {
  message: string;
  classId: number;
}
