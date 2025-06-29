import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AssingMenuComponent } from './components/assing-menu/assing-menu.component';
import { CalendarTutorComponent } from './components/calendar-tutor/calendar-tutor.component';
import { TutorDashboardComponent } from './components/tutor-dashboard/tutor-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'user/login', pathMatch: 'full' },
  { path: 'user/login', component: LoginComponent },
  { path: 'user/register', component: RegisterComponent },
  { path: 'assing-menu', component: AssingMenuComponent },
  { path: 'dashboard-tutor', component: TutorDashboardComponent },
  { path: 'calendar', component: CalendarTutorComponent },
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
