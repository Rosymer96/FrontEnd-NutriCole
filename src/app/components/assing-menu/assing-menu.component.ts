import { Component, computed, inject, signal } from '@angular/core';
import { MenuService } from '../../services/menu/menu.service';
import { MenuResponse } from '../../interfaces/menu';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';

@Component({
  selector: 'app-assing-menu',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './assing-menu.component.html',
  styleUrl: './assing-menu.component.css',
})
export class AssingMenuComponent {
  private menuService = inject(MenuService);

  months = signal([
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

  years = signal(['2024', '2025', '2026']);
  //Se tiene que cambiar por la classId guardada en el localStorage almomento de dar click al boton.
  classId = signal<string>(localStorage.getItem('classId') ?? '');

  menus = signal<MenuResponse[]>([]);
  dateRange = signal<{ start: string; end: string } | null>(null);
  month = signal<string>('');
  year = signal('');

  //Computed para armar el calendario:
  calendar = computed(() => {
    const range = this.dateRange();
    if (!range) return [];

    const start = new Date(range.start);
    const end = new Date(range.end);

    const menuMap = new Map(this.menus().map((menu) => [menu.date, menu]));

    const weeks: any[][] = [];
    let currentWeek: any[] = [];

    // 1. Rellenar los días vacíos al principio de la primera semana
    // El 0 es domingo, 1 es lunes, ..., 6 es sábado. Queremos que el lunes sea el índice 0 de nuestra semana.
    let firstDayOfMonth = new Date(start);
    let dayOfWeekForFirstDay = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday ...

    // Ajustar el día de la semana para que Lunes sea 0, Martes 1, ..., Viernes 4
    // Si es Domingo (0), lo tratamos como 6 para que se salte correctamente.
    // Si es Sábado (6), lo tratamos como 5 para que se salte correctamente.
    // Si es Lunes (1), queremos 0 espacios.
    // Si es Martes (2), queremos 1 espacio.
    // ...
    // Si es Sábado (6) o Domingo (0), no añadimos espacios para días laborables.
    let startPadding = 0;
    if (dayOfWeekForFirstDay !== 0 && dayOfWeekForFirstDay !== 6) {
      // Solo si no es fin de semana
      startPadding = dayOfWeekForFirstDay === 0 ? 6 : dayOfWeekForFirstDay - 1; // Ajuste para Lunes=0, Martes=1...
    }

    // Añadir nulls para los días antes del primer día hábil del mes
    for (let i = 0; i < startPadding; i++) {
      currentWeek.push(null);
    }

    // 2. Iterar a través de los días del mes
    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const dayOfWeek = date.getDay(); // 0 = domingo, 6 = sábado

      // Excluir sábados (6) y domingos (0)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }

      const dateStr = formatDate(date, 'yyyy-MM-dd', 'en-US');
      const menu = menuMap.get(dateStr);

      currentWeek.push({
        date: new Date(date),
        displayDate: formatDate(date, 'dd/MM/yyyy', 'en-US'),
        menu,
      });

      // Si la semana actual tiene 5 días (Lun-Vie), la añadimos y reiniciamos
      if (currentWeek.length === 5) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // 3. Rellenar los días vacíos al final de la última semana
    if (currentWeek.length > 0) {
      while (currentWeek.length < 5) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  });

  get rowCalendar(): boolean {
    return this.calendar()?.length > 0;
  }

  get monthName(): string {
    const value = this.month();
    const match = this.months().find((m) => m.value === value);
    return match?.name ?? '';
  }
  form: FormGroup = new FormGroup({
    monthSelected: new FormControl('', [Validators.required]),
    yearSelected: new FormControl('', [Validators.required]),
  });

  onShowMenu() {
    const { monthSelected, yearSelected } = this.form.value;
    console.log('probando');
    if (this.form.invalid) {
      // debugger;
      this.form.markAllAsTouched();
      return;
    }
    const monthDate = `${monthSelected}-${yearSelected}`;
    console.log(monthDate);
    console.log('classId enviado:', this.classId);
    this.menuService
      .getMenusByClassAndMonth(parseInt(this.classId), monthDate)
      .subscribe({
        next: (resp) => {
          console.log('Respuesta recibida:', resp);
          const menuArray = Object.values(resp.menus);
          this.dateRange.set(resp.dateRange);
          this.menus.set(menuArray);
          this.month.set(monthSelected);
          console.log('Valor de this.menus():', this.menus());
          console.log('Valor de this.moth():', this.month());
          console.log('Valor de range():', this.dateRange());
        },
        error: () => this.menus.set([]),
      });
  }
}
