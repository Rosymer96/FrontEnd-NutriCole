import { ClassService } from './../../../../services/class/class.service';
import { StudentService } from './../../../../services/students/students.service';
import {
  Component,
  inject,
  input,
  OnChanges,
  OnInit,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { capitalizeWords } from '../../../../utils/string-utils';
import { IClass } from '../../../../interfaces/class';
import { IStudent } from '../../../../interfaces/student';
@Component({
  selector: 'app-crear-estudiante',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './crear-estudiante.component.html',
  styleUrl: './crear-estudiante.component.css',
})
export class CrearEstudianteComponent implements OnInit, OnChanges {
  private studentService = inject(StudentService);
  private classService = inject(ClassService);
  private router = inject(Router);

  errorMessage: string = '';
  messageResponse: string = '';
  classes = signal<IClass[]>([]);
  close = output<void>();
  idStudent = input<number | null>(null);
  classId = input<number | null>(null);
  classIdforUpdate = signal<number | null>(null);
  student = signal<IStudent | null>(null);
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
    console.log(this.idStudent());
    if (this.idStudent()) {
      this.loadStudent();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idStudent'] && !changes['idStudent'].firstChange) {
      this.loadStudent();
    }
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
    const tutorDni = this.form.value.tutorDni!.trim().toUpperCase();
    console.log(
      'PROBANDO DATOS A API:',
      name,
      studentDni,
      tutorDni,
      this.classId()
    );
    this.studentService
      .createStudent(name, studentDni, this.classId()!, tutorDni)
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
            err.error?.error || 'No se pudo completar el registro.';
        },
      });
  }

  loadStudent() {
    console.log('prueba1');
    console.log('prueba2');

    this.studentService.getStudentById(this.idStudent()!).subscribe({
      next: (res) => {
        console.log('ESTUDIANTE EDITADO:', res.student);
        this.student.set(res.student);
        this.form.patchValue({
          name: res.student.name,
          studentDni: res.student.student_dni,
          tutorDni: res.student.tutor_dni,
        });
        this.classIdforUpdate.set(res.student.class_id);
      },
      error: (err) => {
        console.error('Error al cargar estudiante', err);
      },
    });
  }
  editStudent() {
    console.log('editando estudiante');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }

    // Normalizar datos antes de enviar
    const name = capitalizeWords(this.form.value.name!);
    const studentDni = this.form.value.studentDni!.trim().toUpperCase();
    const tutorDni = this.form.value.tutorDni!.trim().toUpperCase();
    const classId = this.classIdforUpdate;
    this.studentService
      .editStudent(
        this.idStudent()!,
        name,
        studentDni,
        this.classIdforUpdate()!,
        tutorDni
      )
      .subscribe({
        next: (res) => {
          console.log('Editado exitoso', res);
          this.messageResponse = 'La cuenta ha sido editada con éxito.';
          this.form.reset();
          this.errorMessage = '';
          this.close.emit();
        },
        error: (err) => {
          console.error('Error al editar estudiante', err);
        },
      });
  }
  closeModal() {
    console.log('probando boton de cerrar');
    this.close.emit();
  }
}
