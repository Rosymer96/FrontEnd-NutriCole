export interface IDish {
  idDish: number;
  name: string;
  dish_type: 'primero' | 'segundo' | 'postre';
  description: string;
  active?: number;
}
export interface DishResponse {
  success: boolean;
  data: Dish[];
  count: number;
}
