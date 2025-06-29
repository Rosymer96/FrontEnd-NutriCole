import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar-component',
  imports: [],
  templateUrl: './navbar-component.component.html',
  styleUrl: './navbar-component.component.css',
})
export class NavbarComponentComponent {
  goTo(route: string) {}
  private router = inject(Router);
  private auth = inject(AuthService);

  logout() {
    // Lógica de cierre de sesión: ajusta según tu AuthService
    this.auth.logout();
    // Redirige a login o a la home
    this.router.navigateByUrl('/login');
  }
}
