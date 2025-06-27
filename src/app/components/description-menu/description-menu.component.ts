import {
  Component,
  input,
  OnInit,
  inject,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MenuService } from '../../services/menu/menu.service';
import { MenuByDay } from '../../interfaces/menu';
import { IDish } from '../../interfaces/dish';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-description-menu',
  imports: [CommonModule],
  templateUrl: './description-menu.component.html',
  styleUrl: './description-menu.component.css',
})
export class DescriptionMenuComponent implements OnInit, OnChanges {
  private menuService = inject(MenuService);

  classId = input<string>('');
  date = input<string>('');
  menuId = input<string>('');
  menu = signal<{ date: string; dishes: IDish[] }>({ date: '', dishes: [] });

  ngOnInit(): void {
    this.loadMenu();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['classId'] || changes['date'] || changes['menuId']) {
      this.loadMenu();
    }
  }
  private loadMenu(): void {
    if (this.classId && this.date) {
      this.menuService
        .getMenuByClassAndDay(this.classId(), this.date())
        .subscribe({
          next: (res) => {
            this.menu.set({ date: res.date, dishes: res.dishes });
            console.log('MENUCARGADO:' + this.menu());
          },
          error: () => {
            this.menu.set({ date: '', dishes: [] });
          },
        });
    } else {
      this.menu.set({ date: '', dishes: [] });
    }
  }
}
