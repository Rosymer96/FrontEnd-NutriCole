import { Component, inject, input, OnInit, signal } from '@angular/core';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-note',
  imports: [],
  templateUrl: './note.component.html',
  styleUrl: './note.component.css',
})
export class NoteComponent implements OnInit {
  private noteService = inject(NoteService);
  note = signal<string>('');
  menuId = input<number>(0);

  ngOnInit(): void {
    this.loadNote();
  }
  loadNote() {
    this.noteService.getNote(this.menuId()).subscribe({
      next: (res) => {
        if (res?.note) {
          this.note.set(res.note);
        }
      },
      error: (err) => {
        console.error('Error al obtener la nota:', err);
      },
    });
  }

  saveNote() {
    const id = this.menuId();
    const content = this.note();
    console.log(id, content);

    if (id !== undefined && content) {
      this.noteService.saveOrUpdate(id, content).subscribe({
        next: (res) => console.log(res),
        error: (err) => console.error('Error al guardar la nota:', err),
      });
    } else {
      console.warn('ID de menú o contenido no válido');
    }
  }
}
