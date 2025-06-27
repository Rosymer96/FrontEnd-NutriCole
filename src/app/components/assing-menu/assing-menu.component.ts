import { Component, computed, inject, signal } from '@angular/core';
import { MenuService } from '../../services/menu/menu.service';
import { MenuResponse } from '../../interfaces/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { FormMenuComponent } from '../form-menu/form-menu.component';
import { Month } from '../../interfaces/month';
import { CreateMenuComponent } from '../create-menu/create-menu.component';

@Component({
  selector: 'app-assing-menu',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormMenuComponent,
    CreateMenuComponent,
  ],
  templateUrl: './assing-menu.component.html',
  styleUrl: './assing-menu.component.css',
})
export class AssingMenuComponent {
  private menuService = inject(MenuService);

  //Se tiene que cambiar por la classId guardada en el localStorage almomento de dar click al boton.
  classId = signal<string>(localStorage.getItem('classId') ?? '');
  selectedDate = signal<string>('');
  menuWasCreated = signal(false);

  menus = signal<MenuResponse[]>([]);
  dateRange = signal<{ start: string; end: string } | null>(null);
  month = signal<string>('');
  receivedMonths: Month[] = [];
  errorMessage = '';

  //Computed para armar el calendario, creado con ayuda de IA.
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
  hasPlates = computed(() => {
    return this.calendar().some((week) =>
      week.some((day) => day?.menu?.dishes?.length > 0)
    );
  });
  get monthName(): any {
    const currentMonth = this.month();
    const match = this.receivedMonths.find((m) => m.value === currentMonth);
    return match?.name ?? '';
  }

  onFormSubmit({ month, year }: { month: string; year: string }) {
    const monthDate = `${month}-${year}`;
    console.log(monthDate);
    console.log('classId enviado:', this.classId);
    this.menuService
      .getMenusByClassAndMonth(parseInt(this.classId()), monthDate)
      .subscribe({
        next: (resp) => {
          console.log('Respuesta recibida:', resp);
          const menuArray = Object.values(resp.menus);
          this.dateRange.set(resp.dateRange);
          this.menus.set(menuArray);
          this.month.set(month);
          this.menuWasCreated.set(true);
          console.log('Valor de this.menus():', this.menus());
          console.log('Valor de this.moth():', this.month());
          console.log('Valor de range():', this.dateRange());
          this.errorMessage = '';
        },
        error: (err) => {
          // Extraer mes y año seleccionados
          const [selectedMonth, selectedYear] = monthDate
            .split('-')
            .map(Number);

          // Calcular primer y último día hábil del mes
          const startDate = new Date(selectedYear, selectedMonth - 1, 1);
          const endDate = new Date(selectedYear, selectedMonth, 0); // último día del mes

          // Ajustar dateRange manualmente aunque no haya menús
          this.dateRange.set({
            start: formatDate(startDate, 'yyyy-MM-dd', 'en-US'),
            end: formatDate(endDate, 'yyyy-MM-dd', 'en-US'),
          });

          this.menus.set([]); // vacío
          this.month.set(month);
          this.menuWasCreated.set(false);
          this.errorMessage = ''; // Ocultar el mensaje de error
        },
      });
  }
  onHandleMonths(months: Month[]) {
    this.receivedMonths = months;
  }
  onDateSelect(date: Date) {
    const formatted = formatDate(date, 'yyyy-MM-dd', 'en-US');
    this.selectedDate.set(formatted);
  }
  onMenuSuccessfullyCreated() {
    // Cuando un menú se crea con éxito en CreateMenuComponent,
    // actualiza el calendario y muestra la descripción del menú recién creado.
    this.onFormSubmit({
      month: this.month(),
      year: this.selectedDate().split('-')[0],
    });
    this.selectedDate.set(this.selectedDate());
  }
  openCreateMenu(date: Date) {
    const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    this.selectedDate.set(formattedDate);
  }
}
