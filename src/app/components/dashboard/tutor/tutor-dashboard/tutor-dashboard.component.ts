import { AuthService } from './../../../../services/auth/auth.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { IStudent } from '../../../../interfaces/student';
import { Router, RouterOutlet } from '@angular/router';
import { StudentService } from '../../../../services/students/students.service';
import { IUser } from '../../../../interfaces/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tutor-dashboard',
  imports: [CommonModule],
  templateUrl: './tutor-dashboard.component.html',
  styleUrl: './tutor-dashboard.component.css',
})
export class TutorDashboardComponent implements OnInit {
  private router = inject(Router);
  private studentService = inject(StudentService);
  private authService = inject(AuthService);

  students = signal<IStudent[]>([]);
  user = signal<IUser | null>(null);
  isTutor = false;
  classId = signal<number | null>(null);

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        console.log('PROFILE PORBANDO', profile);
        this.user.set(profile);
        this.isTutor = profile.rol === 'tutor';
      },
      error: (error) => {
        console.error('Error obteniendo perfil:', error);
      },
    });
    this.studentService.getStudentsByTutorId().subscribe({
      next: (response) => {
        this.students.set(response.students);
        console.log('respuesta', response.students);
      },
      error: (error) => {
        console.error('Error obteniendo estudiantes:', error);
      },
    });
  }
  goToCalendar(classId: number) {
    this.classId.set(classId);
    localStorage.setItem('classId', this.classId()!.toString());
    console.log('clasId enviado:', this.classId());
    this.router.navigate(['/tutor-calendar']);
  }
}
