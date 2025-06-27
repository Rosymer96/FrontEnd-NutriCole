import { Component, input } from '@angular/core';

import { IDish } from '../../interfaces/dish';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-description-menu',
  imports: [CommonModule],
  templateUrl: './description-menu.component.html',
  styleUrl: './description-menu.component.css',
})
export class DescriptionMenuComponent {
  classId = input<string>('');
  date = input<string>('');
  menuId = input<string>('');
  menu = input<{ date: string; dishes: IDish[] } | null>(null);
}
