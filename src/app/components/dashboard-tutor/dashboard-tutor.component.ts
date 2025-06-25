import { Component, inject, OnInit, signal } from '@angular/core';
import { IUser } from '../../interfaces/user';
import { AuthService } from '../../services/auth/auth.service';
import { DashboardTutorService } from '../../services/dashboard-tutor/dashboard-tutor.service';
import { Router } from '@angular/router';
import { IClass } from '../../interfaces/class';

@Component({
  selector: 'app-dashboard-tutor',
  imports: [],
  templateUrl: './dashboard-tutor.component.html',
  styleUrl: './dashboard-tutor.component.css',
})
export class DashboardTutorComponent implements OnInit {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardTutorService);
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

    this.dashboardService.getClasses().subscribe({
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
