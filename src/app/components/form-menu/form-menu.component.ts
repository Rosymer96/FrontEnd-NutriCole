import { Component, output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Month } from '../../interfaces/month';
@Component({
  selector: 'app-form-menu',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-menu.component.html',
  styleUrl: './form-menu.component.css',
})
export class FormMenuComponent {
  showMenu = output<{ month: string; year: string }>();
  monthsEmitted = output<Month[]>();
  

  months = signal<Month[]>([
    { name: 'Septiembre', value: '09' },
    { name: 'Octubre', value: '10' },
    { name: 'Noviembre', value: '11' },
    { name: 'Diciembre', value: '12' },
    { name: 'Enero', value: '01' },
    { name: 'Febrero', value: '02' },
    { name: 'Marzo', value: '03' },
    { name: 'Abril', value: '04' },
    { name: 'Mayo', value: '05' },
    { name: 'Junio', value: '06' },
    { name: 'Julio', value: '07' },
  ]);

  years = signal(['2025']);

  form = new FormGroup({
    monthSelected: new FormControl('', [Validators.required]),
  });

  //Metodo para enviar los datos recogidos del form:
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { monthSelected } = this.form.value;
    this.showMenu.emit({
      month: monthSelected!,
      year: this.years()[0],
    });
    this.onEmitMonths();
  }
  onEmitMonths() {
    this.monthsEmitted.emit(this.months());
  }
}
