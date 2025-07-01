import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IStudent, StudentsResponse } from '../../interfaces/student';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private httpClient = inject(HttpClient);
  private baseUrl = `${environment.API_BASE_URL}/student`;

  public getStudentsByTutorId(): Observable<StudentsResponse> {
    return this.httpClient.get<StudentsResponse>(`${this.baseUrl}/listByTutor`);
  }
  public getStudentsByClassId(
    classId:number
  ): Observable<StudentsResponse> {
    return this.httpClient
      .get<StudentsResponse>(`${this.baseUrl}/class/${classId}`)
  }
}
