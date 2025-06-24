import { Component, OnInit, inject  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { IUser } from './../../interfaces/user.d';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})

export class AdminDashboardComponent implements OnInit{

private authService = inject(AuthService);
private router = inject(Router);
 
user: IUser | null = null;
  isAdmin = false;
  newClass = false;

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.user = profile;
        this.isAdmin = profile.rol === 'administrador';
      },
      error: (err) => {
        console.error('Error obteniendo perfil:', err);
      }
    });
  }

  goToCreateDish() {
    if (this.isAdmin) {
      //this.router.navigate(['/admin/create-dish']); Ruta aun no creada
    }
  }

  logout() {
    this.authService.logout();
  }

  addClass() {
    this.newClass = true;
  }


}