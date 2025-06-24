import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { capitalizeWords } from '../../utils/string-utils';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private userService = inject(UsersService);
  private router = inject(Router);

  errorMessage: string = '';
  messageResponse: string = '';

  public form = new FormGroup({
    name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(5),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&.]{5,}$/),
    ]),
    dni: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(9),
      Validators.pattern(/^[A-Z0-9]+$/),
    ]),
  });

  onRegister() {
    console.log('haciendo register');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }

    // Normalizar datos antes de enviar
    const name = capitalizeWords(this.form.value.name!);
    const email = this.form.value.email!.trim().toLowerCase();
    const password = this.form.value.password!;
    const dni = this.form.value.dni!.trim().toUpperCase();

    //Registramos los datos ya validados

    this.userService.register(name, email, password, dni).subscribe({
      next: (response) => {
        if (response) {
          console.log('Registro exitoso', response);
          this.messageResponse = 'La cuenta ha sido registrada con éxito.';
          this.form.reset();
          this.errorMessage = '';
        } else {
          alert('Registro fallido.');
        }
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error en register:', err);
        this.errorMessage =
          err.error?.message || 'No se pudo completar el registro.';
      },
    });
  }
  goToLogin(){
    this.router.navigate(['/']);
  }
}
