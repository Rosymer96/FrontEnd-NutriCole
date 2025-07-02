import { IStudent } from './../../interfaces/student.d';
import { Component, inject, OnInit, signal } from '@angular/core';
import { StudentService } from '../../services/students/students.service';
import { CommonModule } from '@angular/common';
import { CrearEstudianteComponent } from '../crear-estudiante/crear-estudiante.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-class',
  imports: [CommonModule, CrearEstudianteComponent],
  templateUrl: './class.component.html',
  styleUrl: './class.component.css',
})
export class ClassComponent implements OnInit {
  private studentService = inject(StudentService);
  private router = inject(Router);


  classId = signal<number>(Number(localStorage.getItem('classId')) ?? 0);
  students = signal<IStudent[] | null>(null);
  className = signal<string>('');
  idStudent = signal<number | null>(null);
  formStudent = false;
  deleteStudentModal = false;

  ngOnInit(): void {
    this.loadStudents();
  }
  loadStudents() {
    this.studentService.getStudentsByClassId(this.classId()!).subscribe({
      next: (res) => {
        console.log('STUDENTS:', res.students);
        this.students.set(res.students);
        this.className.set(res.class!);
      },
      error(err) {
        console.error('Error loading students:', err);
      },
    });
  }
  toggleActive(idStudent: number, active: number) {
    console.log(idStudent, active);
    if (active === 0) {
      this.studentService.activeStudent(idStudent).subscribe({
        next: (res) => {
          console.log(res.message);
          this.loadStudents();
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      this.studentService.desactiveStudent(idStudent).subscribe({
        next: (res) => {
          console.log(res.message);
          this.loadStudents();
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  getId(idStudent: number) {
    this.idStudent.set(idStudent);
    this.deleteStudentModal = true;
  }
  getIdForEdit(idStudent: number) {
    this.idStudent.set(idStudent);
    console.log('ENVIANDO ID', this.idStudent());
    this.formStudent = true;
  }

  deleteStudent(idStudent: number) {
    console.log('IDPARABORRAR:', idStudent);
    this.studentService.deleteStudent(idStudent).subscribe({
      next: (res) => {
        console.log(res.message);
        this.loadStudents();
        this.close();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  close() {
    this.deleteStudentModal = false;
  }
  openFormStudent() {
    this.formStudent = true;
  }
  onCloseForm() {
    this.formStudent = false;
    this.loadStudents();
    this.idStudent.set(null);
  }
  goToDashboard() {
    this.router.navigate(['/dashboard-admin']);
  }
}
