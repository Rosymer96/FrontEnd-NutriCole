import { Component, input, OnInit, inject, signal } from '@angular/core';
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
export class DescriptionMenuComponent implements OnInit {
  private menuService = inject(MenuService);

  classId = input<string>('');
  date = input<string>('');
  menu = signal<{ date: string; dishes: IDish[] }>({ date: '', dishes: [] });

  ngOnInit(): void {
    this.menuService
      .getMenuByClassAndDay(this.classId(), this.date())
      .subscribe({
        next: (res) => {
          this.menu.set({ date: res.date, dishes: res.dishes });
        },
        error: (err) => {
          this.menu.set({ date: '', dishes: [] });
        },
      });
  }
}
