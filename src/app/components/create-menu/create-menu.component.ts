import { DishService } from './../../services/dish/dish.service';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IDish } from '../../interfaces/dish';
import { MenuService } from '../../services/menu/menu.service';
import { DescriptionMenuComponent } from '../description-menu/description-menu.component';
import { MenuByDay, MenuResponse } from '../../interfaces/menu';

@Component({
  selector: 'app-create-menu',
  imports: [ReactiveFormsModule, DescriptionMenuComponent, FormsModule],
  templateUrl: './create-menu.component.html',
  styleUrl: './create-menu.component.css',
})
export class CreateMenuComponent implements OnInit {
  private dishService = inject(DishService);
  private menuService = inject(MenuService);

  // Signals
  allDishes = signal<IDish[]>([]);
  selectedFirstDishId = signal<number | null>(null);
  selectedSecondDishId = signal<number | null>(null);
  selectedDessertDishId = signal<number | null>(null);
  menuCreatedSignal = signal(false);
  showDescription = signal(true);
  existingMenu = input<MenuResponse | null>(null);

  menuDataForDescription = signal<{ date: string; dishes: IDish[] }>({
    date: '',
    dishes: [],
  });

  messageResponse = '';
  errorMessage = '';
  onMenuCreate = false;
  menuId = signal<string>('');

  // Inputs y Outputs
  date = input<string>('');
  classId = input<string>('');
  menuCreated = output<void>();
  close = output<void>();

  // Getters para ngModel
  get firstDishId(): number | null {
    return this.selectedFirstDishId();
  }
  set firstDishId(val: number | null) {
    this.selectedFirstDishId.set(val);
    this.updateMenuDescription();
  }

  get secondDishId(): number | null {
    return this.selectedSecondDishId();
  }
  set secondDishId(val: number | null) {
    this.selectedSecondDishId.set(val);
    this.updateMenuDescription();
  }

  get dessertDishId(): number | null {
    return this.selectedDessertDishId();
  }
  set dessertDishId(val: number | null) {
    this.selectedDessertDishId.set(val);
    this.updateMenuDescription();
  }

  // Computed
  firstDishes = computed(() =>
    this.allDishes().filter((dish) => dish.dish_type === 'primero')
  );
  secondDishes = computed(() =>
    this.allDishes().filter((dish) => dish.dish_type === 'segundo')
  );
  dessertDishes = computed(() =>
    this.allDishes().filter((dish) => dish.dish_type === 'postre')
  );

  // Platos seleccionados completos
  selectedFirstDish = computed(
    () =>
      this.allDishes().find((d) => d.idDish === this.selectedFirstDishId()) ||
      null
  );
  selectedSecondDish = computed(
    () =>
      this.allDishes().find((d) => d.idDish === this.selectedSecondDishId()) ||
      null
  );
  selectedDessertDish = computed(
    () =>
      this.allDishes().find((d) => d.idDish === this.selectedDessertDishId()) ||
      null
  );

  ngOnInit(): void {
    this.dishService.getAllDishes().subscribe({
      next: (resp) => {
        this.allDishes.set(resp.data);

        // Si es edición, pre-cargar datos
        if (this.existingMenu()) {
          const dishes = this.existingMenu()!.dishes;
          console.log('dishes:', dishes);
          const firstId = dishes[0]?.idDish || null;
          const secondId = dishes[1]?.idDish || null;
          const dessertId = dishes[2]?.idDish || null;

          this.selectedFirstDishId.set(firstId);
          this.selectedSecondDishId.set(secondId);
          this.selectedDessertDishId.set(dessertId);

          console.log('Ids seteados:', firstId, secondId, dessertId);
          console.log(
            'Valores signals:',
            this.selectedFirstDishId(),
            this.selectedSecondDishId(),
            this.selectedDessertDishId()
          );
          this.menuId.set(this.existingMenu()!.id.toString());
          this.updateMenuDescription();
          this.onMenuCreate = true;
          console.log('EXISTING', this.existingMenu);
          console.log(
            'ids:',
            this.selectedDessertDishId(),
            this.selectedFirstDishId()
          ); // Mostrar botones editar/eliminar

          this.menuDataForDescription.set({
            date: this.existingMenu()!.date,
            dishes: this.existingMenu()!.dishes,
          });
        }
      },
      error: () => this.allDishes.set([]),
    });
  }

  updateMenuDescription() {
    const dishes = [
      this.selectedFirstDish(),
      this.selectedSecondDish(),
      this.selectedDessertDish(),
    ].filter((dish): dish is IDish => dish !== null);
    this.menuDataForDescription.set({
      date: this.date(),
      dishes,
    });
  }

  createMenu() {
    if (
      !this.selectedFirstDishId() ||
      !this.selectedSecondDishId() ||
      !this.selectedDessertDishId()
    ) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    this.menuService
      .createMenu(
        this.date(),
        this.classId(),
        this.selectedFirstDishId()!,
        this.selectedSecondDishId()!,
        this.selectedDessertDishId()!
      )
      .subscribe({
        next: (res) => {
          this.messageResponse = 'Menú creado con éxito.';
          this.errorMessage = '';
          this.menuCreatedSignal.set(true);
          this.onMenuCreate = true;
          this.menuCreated.emit();
          this.menuId.set(res.menuId);
          this.menuDataForDescription.set({
            date: res.date,
            dishes: res.menu,
          });
          console.log(this.menuDataForDescription());
          console.log(res);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'No se pudo crear el menú';
        },
      });
  }

  cancel() {
    this.selectedFirstDishId.set(null);
    this.selectedSecondDishId.set(null);
    this.selectedDessertDishId.set(null);
    this.menuDataForDescription.set({ date: '', dishes: [] });
    this.close.emit();
  }

  deleteMenu() {
    this.menuService.deleteMenu(this.menuId()).subscribe({
      next: () => {
        this.messageResponse = 'Menú eliminado con éxito.';
        this.menuCreatedSignal.set(false);
        this.onMenuCreate = false;
        this.cancel();
        this.menuCreated.emit();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'No se pudo eliminar el menú';
      },
    });
  }

  editMenu() {
    this.menuService
      .editMenu(
        this.menuId(),
        this.selectedFirstDishId()!,
        this.selectedSecondDishId()!,
        this.selectedDessertDishId()!
      )
      .subscribe({
        next: (res) => {
          this.messageResponse = 'Menú editado con éxito.';
          this.errorMessage = '';
          this.menuCreated.emit();
          this.menuDataForDescription.set({
            date: res.date,
            dishes: res.menu,
          });
          console.log(this.menuDataForDescription());
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'No se pudo editar el menú';
        },
      });
  }
}
