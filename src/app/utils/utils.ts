import { HttpHeaders } from "@angular/common/http";

export function obtenertoken(): string | null {
  const authtoken = localStorage.getItem('authtoken');
  return authtoken ? authtoken : null;
}

export function obtenerHeaders(): HttpHeaders {
  const token = obtenertoken();
  return new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
}