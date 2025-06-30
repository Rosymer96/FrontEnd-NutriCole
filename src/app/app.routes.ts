import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/dashboard_admin/admin-dashboard.component';
import { AssingMenuComponent } from './components/assing-menu/assing-menu.component';
import { CreateMenuComponent } from './components/create-menu/create-menu.component';

export const routes: Routes = [

  { path: '', redirectTo: 'user/login', pathMatch: 'full' },
  { path: 'user/login', component: LoginComponent },
  { path: 'user/register', component: RegisterComponent },
  { path: 'assing-menu', component: AssingMenuComponent },
  { path: 'create-menu', component: CreateMenuComponent },
  {path: 'dashboard/admin', component: AdminDashboardComponent},
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
