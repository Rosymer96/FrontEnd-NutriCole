import { Component, inject, signal } from '@angular/core';
import { MenuService } from '../../services/menu/menu.service';
import { MenuResponse } from '../../interfaces/menu';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assing-menu',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './assing-menu.component.html',
  styleUrl: './assing-menu.component.css',
})
export class AssingMenuComponent {
  private menuService = inject(MenuService);

  months = signal([
    { nombre: 'Septiembre', valor: '09' },
    { nombre: 'Octubre', valor: '10' },
    { nombre: 'Noviembre', valor: '11' },
    { nombre: 'Diciembre', valor: '12' },
    { nombre: 'Enero', valor: '01' },
    { nombre: 'Febrero', valor: '02' },
    { nombre: 'Marzo', valor: '03' },
    { nombre: 'Abril', valor: '04' },
    { nombre: 'Mayo', valor: '05' },
    { nombre: 'Junio', valor: '06' },
    { nombre: 'Julio', valor: '07' },
  ]);

  years = signal(['2024', '2025', '2026']);
  //Se tiene que cambiar por la classId guardada en el localStorage almomento de dar click al boton.
  classId: string = '1';

  menus = signal<MenuResponse[]>([]);

  form: FormGroup = new FormGroup({
    monthSelected: new FormControl('', [Validators.required]),
    yearSelected: new FormControl('', [Validators.required]),
  });

  onShowMenu() {
    console.log('probando');
    if (this.form.invalid) {
      // debugger;
      this.form.markAllAsTouched();
      return;
    }
    const { monthSelected, yearSelected } = this.form.value;
    const monthDate = `${monthSelected}-${yearSelected}`;
    console.log(monthDate);
    console.log('classId enviado:', this.classId);
    this.menuService
      .getMenusByClassAndMonth(parseInt(this.classId), monthDate)
      .subscribe({
        next: (resp) => {
          console.log('Respuesta recibida:', resp);
          const menuArray = Object.values(resp.menus);
          this.menus.set(menuArray);
          console.log('Valor de this.menus():', this.menus());
        },
        error: () => this.menus.set([]),
      });
  }
}
