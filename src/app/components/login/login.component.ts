import { AuthService } from './../../services/auth/auth.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  public form = new FormGroup({
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(5),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&.]{5,}$/),
    ]),
  });

  onLogin() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }
    // Normalizar datos antes de enviar
    const email = this.form.value.email?.trim().toLowerCase() || '';
    const password = this.form.value.password || '';
    console.log('email', email, 'pasword:', password);
    //Si los datos son correctos va al profile.
    this.authService.login(email, password).subscribe({
      next: (user) => {
        console.log('PROBANDO LOGIN', user);
        if (user) {
          const rol = user.rol;
          if (rol === 'administrador') {
            this.router.navigate(['/dashboard-admin']);
          } else if (rol === 'tutor') {
            this.router.navigate(['/dashboard-tutor']);
          } else {
            this.router.navigate(['/']);
          }
        }
      },
      error: (err) => {
        console.error('Error en login:', err);
        // alert(err.error?.message || 'Error desconocido');
        this.errorMessage =
          err.error?.message || 'Email o contraseña inválidos';
      },
    });
  }

  goToRegister() {
    //Enviar a la ruta para registrarse.
    this.router.navigate(['/user/register']);
  }
}
