export interface Dish {
  idDish: number; // Agregar el id opcional
  name: string;
  dish_type: string;
  description: string;
  active: number;
}

// Agregar estas nuevas interfaces
export interface CrearDishDto {
  name: string;
  dishType: string;
  description: string;
  active: number;
}

export interface ActualizarDishDto {
  name?: string;
  dishType?: string;
  description?: string;
  active?: number;
}

