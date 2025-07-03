import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { IUser } from './../../interfaces/user.d';
import { IClass } from '../../interfaces/class';
import { ClassService } from '../../services/class/class.service';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { capitalizeWords } from '../../utils/string-utils';

@Component({
  selector: 'app-admin-dashboard',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private classService = inject(ClassService);
  private router = inject(Router);

  user: IUser | null = null;
  isAdmin = false;
  newClass = false;
  classes = signal<IClass[]>([]);
  errorMessage: string = '';

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.user = profile;
        this.isAdmin = profile.rol === 'administrador';
        console.log('probando el getprofile' + profile.rol);
      },
      error: (err) => {
        console.error('Error obteniendo perfil:', err);
        this.router.navigate(['/login']);
      },
    });

    this.loadClasses();
  }

  public form = new FormGroup({
    name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(12),
    ]),
  });

  goToCreateDish() {
    this.router.navigate(['/admin/dishes']);
  }
  goToClassMenu(classId: number): void {
    localStorage.setItem('classId', `${classId}`);
    console.log('classId', classId);
    this.router.navigate(['/assing-menu']);
  }
  goToClass(classId: number): void {
    localStorage.setItem('classId', `${classId}`);
    console.log('classId', classId);
    this.router.navigate(['/class']);
  }
  logout() {
    this.authService.logout();
  }

  addClass() {
    const rawName = this.form.value.name;

    if (!rawName || rawName.trim() === '') {
      this.form.markAllAsTouched();
      return;
    }

    const name = capitalizeWords(rawName.trim());
    this.classService.addClass(name).subscribe({
      next: (response) => {
        console.log('Clase registrada:' + name);
        this.form.reset();
        this.loadClasses();
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error en register:', err);
        this.errorMessage =
          err.error?.message || 'No se pudo completar el registro.';
      },
    });
  }
  private loadClasses() {
    this.classService.getClasses().subscribe({
      next: (response) => {
        this.classes.set(response.data);
        console.log(this.classes());
      },
      error: (err) => {
        console.error('Error obteniendo las clases', err);
      },
    });
  }
}
