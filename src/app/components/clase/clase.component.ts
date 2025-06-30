import { Component, inject, OnInit } from '@angular/core';
import { StudentService } from '../../services/students/students.service';
import { IStudent } from '../../interfaces/student';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clase',
  imports: [],
  templateUrl: './clase.component.html',
  styleUrl: './clase.component.css',
})
export class ClaseComponent implements OnInit {
  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);

  classId!: string | number;
  students: IStudent[] = [];

  ngOnInit(): void {
    this.classId = this.route.snapshot.paramMap.get('classId') ?? 0;
    this.loadStudents();
  }
  private loadStudents(): void {
    this.studentService.getStudentsByClassId(this.classId).subscribe({
      next: (res) => (this.students = res.data),
      error: (err) => console.error('Error al cargar estudiantes', err),
    });
  }
}
