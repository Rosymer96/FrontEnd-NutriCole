import { DishService } from './../../services/dish/dish.service';
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IDish } from '../../interfaces/dish';
import { MenuService } from '../../services/menu/menu.service';
import { DescriptionMenuComponent } from '../description-menu/description-menu.component';

@Component({
  selector: 'app-create-menu',
  imports: [ReactiveFormsModule, DescriptionMenuComponent],
  templateUrl: './create-menu.component.html',
  styleUrl: './create-menu.component.css',
})
export class CreateMenuComponent implements OnInit {
  private dishService = inject(DishService);
  private menuService = inject(MenuService);
  menuCreatedSignal = signal(false);

  menuCreated = output<void>();
  close = output<void>();

  allDishes = signal<IDish[]>([]);
  menuCreatedData = signal<{ date: string; dishes: IDish[] } | null>(null);

  // Inputs
  date = input<string>('');
  classId = input<string>('');

  messageResponse: string = '';
  errorMessage: string = '';

  // Señales derivadas para clasificar los platos
  firstDishes = computed(() =>
    this.allDishes().filter((dish) => dish.dish_type === 'primero')
  );

  secondDishes = computed(() =>
    this.allDishes().filter((dish) => dish.dish_type === 'segundo')
  );

  dessertDishes = computed(() =>
    this.allDishes().filter((dish) => dish.dish_type === 'postre')
  );

  form = new FormGroup({
    first: new FormControl('', [Validators.required]),
    second: new FormControl('', [Validators.required]),
    dessert: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.dishService.getAllDishes().subscribe({
      next: (resp) => {
        this.allDishes.set(resp.data);
      },
      error: () => {
        this.allDishes.set([]);
      },
    });
  }

  createMenu() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { first, second, dessert } = this.form.value;
    // Buscar objetos de plato completos por id
    const firstDish = this.allDishes().find((d) => d.idDish === Number(first));
    const secondDish = this.allDishes().find(
      (d) => d.idDish === Number(second)
    );
    const dessertDish = this.allDishes().find(
      (d) => d.idDish === Number(dessert)
    );

    this.menuService
      .createMenu(this.date(), this.classId(), first!, second!, dessert!)
      .subscribe({
        next: () => {
          this.messageResponse = 'Menú creado con éxito.';
          this.errorMessage = '';
          this.menuCreatedData.set({
            date: this.date(),
            dishes: [firstDish!, secondDish!, dessertDish!],
          });
          this.menuCreatedSignal.set(true);
          this.menuCreated.emit();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'No se pudo crear el menú';
        },
      });
  }

  cancel() {
    this.form.reset();
    this.form.reset();
    this.close.emit();
  }
}
