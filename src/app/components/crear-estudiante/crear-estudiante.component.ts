import { ClassService } from './../../services/class/class.service';
import { StudentService } from './../../services/students/students.service';
import { Component, inject, OnInit, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { capitalizeWords } from '../../utils/string-utils';
import { IClass } from '../../interfaces/class';
@Component({
  selector: 'app-crear-estudiante',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './crear-estudiante.component.html',
  styleUrl: './crear-estudiante.component.css',
})
export class CrearEstudianteComponent implements OnInit {
  private studentService = inject(StudentService);
  private classService = inject(ClassService);
  private router = inject(Router);

  errorMessage: string = '';
  messageResponse: string = '';
  classes = signal<IClass[]>([]);
  close = output<void>();

  ngOnInit(): void {
    this.classService.getClasses().subscribe({
      next: (response) => {
        this.classes.set(response.data);
        console.log(this.classes());
      },
      error: (err) => {
        console.error('Error obteniendo las clases', err);
      },
    });
  }

  public form = new FormGroup({
    name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    studentDni: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(9),
      Validators.pattern(/^[A-Z0-9]+$/),
    ]),
    classId: new FormControl<number | null>(null, [
      Validators.required,
      Validators.maxLength(2),
    ]),
    tutorDni: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(9),
      Validators.pattern(/^[A-Z0-9]+$/),
    ]),
  });

  createStudent() {
    console.log('haciendo register');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }

    // Normalizar datos antes de enviar
    const name = capitalizeWords(this.form.value.name!);
    const studentDni = this.form.value.studentDni!.trim().toUpperCase();
    const classId = Number(this.form.value.classId);
    const tutorDni = this.form.value.tutorDni!.trim().toUpperCase();

    this.studentService
      .createStudent(name, studentDni, classId, tutorDni)
      .subscribe({
        next: (res) => {
          console.log('Registro exitoso', res);
          this.messageResponse = 'La cuenta ha sido registrada con éxito.';
          this.form.reset();
          this.errorMessage = '';
          this.close.emit();
        },
        error: (err) => {
          console.error('Error en register:', err);
          this.errorMessage =
            err.error?.message || 'No se pudo completar el registro.';
        },
      });
  }
}
