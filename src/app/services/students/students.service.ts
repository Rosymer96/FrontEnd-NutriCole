import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IStudent, StudentsResponse } from '../../interfaces/student';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private httpClient = inject(HttpClient);
  private baseUrl = `${environment.API_BASE_URL}/student`;

  public createStudent(
    name: string,
    studentDni: string,
    classId: number,
    tutorDni: string
  ): Observable<{ message: string; idStudent: number }> {
    return this.httpClient.post<{ message: string; idStudent: number }>(
      `${this.baseUrl}/create`,
      { name, studentDni, classId, tutorDni }
    );
  }
  public editStudent(
    idStudent: number,
    name: string,
    studentDni: string,
    classId: number,
    tutorDni: string
  ): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(
      `${this.baseUrl}/${idStudent}`,
      { name, studentDni, classId, tutorDni }
    );
  }
  public getStudentsByTutorId(): Observable<StudentsResponse> {
    return this.httpClient.get<StudentsResponse>(`${this.baseUrl}/by/tutor`);
  }
  public getStudentsByClassId(classId: number): Observable<StudentsResponse> {
    return this.httpClient.get<StudentsResponse>(
      `${this.baseUrl}/class/${classId}`
    );
  }
  public getStudentById(
    idStudent: number
  ): Observable<{ message: string; student: IStudent }> {
    return this.httpClient.get<{ message: string; student: IStudent }>(
      `${this.baseUrl}/${idStudent}`
    );
  }
  public activeStudent(idStudent: number): Observable<{ message: string }> {
    return this.httpClient.patch<{ message: string }>(
      `${this.baseUrl}/active`,
      { idStudent }
    );
  }
  public desactiveStudent(idStudent: number): Observable<{ message: string }> {
    return this.httpClient.patch<{ message: string }>(
      `${this.baseUrl}/desactive`,
      { idStudent }
    );
  }
  public deleteStudent(idStudent: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(
      `${this.baseUrl}/${idStudent}`
    );
  }
}
