import { Component, computed, input, output, signal } from '@angular/core';

import { IDish } from '../../../interfaces/dish';
import { CommonModule } from '@angular/common';
import { SelectedDayMenu } from '../../../interfaces/menu';
import { NoteComponent } from '../../dashboard/tutor/note/note.component';

@Component({
  selector: 'app-description-menu',
  imports: [CommonModule, NoteComponent],
  templateUrl: './description-menu.component.html',
  styleUrl: './description-menu.component.css',
})
export class DescriptionMenuComponent {
  classId = input<string>('');
  date = input<string>('');
  menu = input<{ date: string; dishes: IDish[] } | null>(null);
  menuofDay = input<SelectedDayMenu | null>(null);
  closeMenu = output<void>();

menuId = computed(() => this.menuofDay()?.menu?.id ?? -1);
  close() {
    this.closeMenu.emit();
  }
}
