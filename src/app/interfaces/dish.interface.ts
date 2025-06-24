// Interfaz para el modelo Dish según tu tabla
export interface Dish {
  idDish?: number;        // Auto-increment, opcional al crear
  name: string;           // Nombre del plato
  dish_type: string;      // Tipo de plato (primero, segundo, postre)
  description: string;    // Descripción del plato
  active: number;         // Estado activo (1) o inactivo (0)
}

// Interfaz para crear un nuevo dish (sin idDish)
export interface CrearDishDto {
  name: string;
  dish_type: string;
  description: string;
  active: number;
}

// Interfaz para actualizar un dish
export interface ActualizarDishDto {
  name?: string;
  dish_type?: string;
  description?: string;
  active?: number;
}