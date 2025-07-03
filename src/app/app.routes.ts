import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AssingMenuComponent } from './components/dashboard/admin/assing-menu/assing-menu.component';
import { CreateMenuComponent } from './components/dashboard/admin/create-menu/create-menu.component';
import { AdminDashboardComponent } from './components/dashboard/admin/dashboard_admin/admin-dashboard.component';
import { TutorDashboardComponent } from './components/dashboard/tutor/tutor-dashboard/tutor-dashboard.component';
import { CalendarTutorComponent } from './components/dashboard/tutor/calendar-tutor/calendar-tutor.component';
import { ClassComponent } from './components/dashboard/admin/class/class.component';
import { NavbarComponentComponent } from './components/layout/navbar/navbar-component.component';
import { FooterComponentComponent } from './components/layout/footer/footer-component.component';
import { MenuCreationComponent } from './components/dashboard/admin/menu-creation/menu-creation.component';

export const routes: Routes = [
  { path: '', redirectTo: 'user/login', pathMatch: 'full' },
  { path: 'user/login', component: LoginComponent },
  { path: 'user/register', component: RegisterComponent },

  // RUTAS DEL ADMIN
  {
    path: 'assing-menu',
    canActivate: [authGuard, roleGuard],
    data: { role: 'administrador' },
    component: AssingMenuComponent,
  },
  {
    path: 'create-menu',
    canActivate: [authGuard, roleGuard],
    data: { role: 'administrador' },
    component: CreateMenuComponent,
  },
  {
    path: 'dashboard-admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'administrador' },
    component: AdminDashboardComponent,
  },
  {
    path: 'class',
    canActivate: [authGuard, roleGuard],
    data: { role: 'administrador' },
    component: ClassComponent,
  },
  {
    path: 'admin/dishes',
    canActivate: [authGuard, roleGuard],
    data: { role: 'administrador' },
    component: MenuCreationComponent,
  },

  // RUTAS DEL TUTOR
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

  // COMPONENTES COMUNES
  { path: 'header', component: NavbarComponentComponent },
  { path: 'footer', component: FooterComponentComponent },
];
