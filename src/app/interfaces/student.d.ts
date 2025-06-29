export interface IStudent {
  idStudent: 1;
  name: string;
  student_dni: string;
  class_id: number;
  tutor_dni: string;
  tutor_id: number;
  class_name: string;
}

export interface StudentsResponse {
  success: string;
  students: IStudent[];
}
