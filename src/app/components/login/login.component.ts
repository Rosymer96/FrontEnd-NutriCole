import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
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
  private userService = inject(UsersService);
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
    ]),
  });

  onLogin() {
    console.log('haciendo login');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }
    //Si los datos son correctos va al profile.
    this.userService
      .login(this.form.value.email!, this.form.value.password!)
      .subscribe({
        next: (user) => {
          if (user) {
            console.log('Login exitoso', user);
            //Redireccionar al profile dependiendo del rol.
          } else {
            alert('Credenciales inválidas');
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
    this.router.navigate(['/register']);
  }
}
