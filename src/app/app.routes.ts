import { FooterComponentComponent } from './components/footer-component/footer-component.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TutorDashboardComponent } from './components/tutor-dashboard/tutor-dashboard.component';
import { NavbarComponentComponent } from './components/navbar-component/navbar-component.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard-tutor', component: TutorDashboardComponent },
  { path: 'navbar', component: NavbarComponentComponent },
 
];

//Ejemplo de paths usando la verificacion de las guards:
//  {
//     path: 'admin',
//     canActivate: [authGuard, roleGuard],
//     data: { role: 'admin' }, // <- Aquí defines el rol requerido
//     loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
//   },
//   {
//     path: 'user',
//     canActivate: [authGuard, roleGuard],
//     data: { role: 'user' },
//     loadComponent: () => import('./pages/user/user.component').then(m => m.UserComponent)
//   },
