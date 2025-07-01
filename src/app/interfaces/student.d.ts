export interface IStudent {
  idStudent: number;
  name: string;
  student_dni: string;
  class_id: number;
  tutor_dni: string;
  tutor_id: number;
  class_name?: string;
  active: number;
}

export interface StudentsResponse {
  success: string;
  class?: string;
  students: IStudent[];
}
