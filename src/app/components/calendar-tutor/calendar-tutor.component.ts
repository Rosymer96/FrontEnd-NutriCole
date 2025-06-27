import { Component, computed, inject, signal } from '@angular/core';
import { MenuResponse, SelectedDayMenu } from '../../interfaces/menu';
import { Month } from '../../interfaces/month';
import { MenuService } from '../../services/menu/menu.service';
import { formatDate } from '@angular/common';
import { FormMenuComponent } from '../form-menu/form-menu.component';
import { DescriptionMenuComponent } from "../description-menu/description-menu.component";

@Component({
  selector: 'app-calendar-tutor',
  imports: [FormMenuComponent, DescriptionMenuComponent],
  templateUrl: './calendar-tutor.component.html',
  styleUrl: './calendar-tutor.component.css',
})
export class CalendarTutorComponent {
  private menuService = inject(MenuService);

  //Se tiene que cambiar por la classId guardada en el localStorage almomento de dar click al boton.
  classId = signal<string>(localStorage.getItem('classId') ?? '');

  menus = signal<MenuResponse[]>([]);
  menuOfDay = signal<SelectedDayMenu | null>(null);
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
          this.errorMessage = '';
        },
        error: (err) => {
          this.menus.set([]);
          this.errorMessage = err.error?.error || 'Calendario no encontrado.';
        },
      });
  }
  onHandleMonths(months: Month[]) {
    this.receivedMonths = months;
    console.log(this.receivedMonths);
  }
  onShowDescription(dayData: {
    date: Date;
    displayDate: string;
    menu: MenuResponse | undefined;
  }) {
    const formattedDate = formatDate(dayData.date, 'yyyy-MM-dd', 'en-US');
    this.menuOfDay.set({
      date: formattedDate,
      menu: dayData.menu || null, // Asegura que 'menu' sea MenuResponse o null
    });

    console.log('Menú y fecha seleccionados en menuOfDay:', this.menuOfDay());
  }
}
