import { Component, OnInit, output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Month } from '../../interfaces/month';

@Component({
  selector: 'app-form-menu',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './form-menu.component.html',
  styleUrl: './form-menu.component.css',
})
 
export class FormMenuComponent implements OnInit{

  ngOnInit(): void {
  // Emitir automáticamente el mes actual al iniciar
  this.showMenu.emit({
    month: this.monthSelected(),
    year: this.years()[0],
  });

  // Emitir la lista de meses también
  this.monthsEmitted.emit(this.months());
}
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
  currentMonth: string = new Date().toLocaleString('en-US', {
    month: '2-digit',
    timeZone: 'Europe/Madrid',
  });
  monthSelected = signal<string>(this.currentMonth);

  //Metodo para enviar los datos recogidos del form:
  onSubmit() {
    this.showMenu.emit({
      month: this.monthSelected(),
      year: this.years()[0],
    });
    this.onEmitMonths();
  }
  onEmitMonths() {
    this.monthsEmitted.emit(this.months());
  }
}
