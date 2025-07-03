import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/dashboard_admin/admin-dashboard.component';
import { AssingMenuComponent } from './components/assing-menu/assing-menu.component';
import { CreateMenuComponent } from './components/create-menu/create-menu.component';
import { CalendarTutorComponent } from './components/calendar-tutor/calendar-tutor.component';
import { TutorDashboardComponent } from './components/tutor-dashboard/tutor-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { ClassComponent } from './components/class/class.component';
import { NavbarComponentComponent } from './components/navbar-component/navbar-component.component';
import { FooterComponentComponent } from './components/footer-component/footer-component.component';
import { MenuCreationComponent } from './components/menu-creation/menu-creation.component';

export const routes: Routes = [
  { path: '', redirectTo: 'user/login', pathMatch: 'full' },
  { path: 'user/login', component: LoginComponent },
  { path: 'user/register', component: RegisterComponent },
  { path: 'assing-menu', component: AssingMenuComponent },
  { path: 'create-menu', component: CreateMenuComponent },
  { path: 'dashboard-admin', component: AdminDashboardComponent },
  {
    path: 'dashboard-tutor',
    canActivate: [authGuard],
    data: { role: 'tutor' },
    component: TutorDashboardComponent,
  },
  {
    path: 'tutor-calendar',
    canActivate: [authGuard, roleGuard],
    data: { role: 'tutor' },
    component: CalendarTutorComponent,
  },
  { path: 'class', component: ClassComponent },
  { path: 'header', component: NavbarComponentComponent },
  { path: 'footer', component: FooterComponentComponent },
  { path: 'admin/dishes', component: MenuCreationComponent },
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
