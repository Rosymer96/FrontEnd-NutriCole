import { Component, inject, OnInit, signal } from '@angular/core';
import { StudentService } from '../../services/students/students.service';
import { IStudent } from '../../interfaces/student';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-class',
  imports: [CommonModule],
  templateUrl: './class.component.html',
  styleUrl: './class.component.css',
})
export class ClassComponent implements OnInit {
  private studentService = inject(StudentService);
  classId = signal<number>(Number(localStorage.getItem('classId')) ?? 0);
  students = signal<IStudent[] | null>(null);
  className = signal<string>('');

  ngOnInit(): void {
    this.loadStudents();
  }
  loadStudents() {
    this.studentService.getStudentsByClassId(this.classId()!).subscribe({
      next: (res) => {
        console.log('STUDENTS:', res.students);
        this.students.set(res.students);
        this.className.set(res.class!)
      },
      error(err) {
        console.error('Error loading students:', err);
      },
    });
  }
  editStudent(idStudent:number){

  }
  toggleActive(idStudent:number){

  }
  deleteStudent(idStudent:number){

  }
}
