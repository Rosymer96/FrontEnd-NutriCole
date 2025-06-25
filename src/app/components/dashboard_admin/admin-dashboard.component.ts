import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { IUser } from './../../interfaces/user.d';
import { IClass } from '../../interfaces/class';
import { ClassService } from '../../services/class/class.service';

@Component({
  selector: 'app-admin-dashboard',
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

  goToCreateDish() {
    if (this.isAdmin) {
      //this.router.navigate(['/admin/create-dish']); Ruta aun no creada
    }
  }
  goToClass() {}
  logout() {
    this.authService.logout();
  }

  addClass() {
    this.newClass = true;
  }
}
