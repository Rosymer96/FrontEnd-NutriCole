import { IDish } from './dish';

export interface MenuByMonthResponse {
  message: string;
  classId: string | number;
  dateRange: { start: string; end: string };
  menus: MenuResponse[];
}

export interface MenuResponse {
  date: string;
  id: number;
  dishes: IDish[];
}
export interface MenuResponseCreated {
  message: string;
  menuId: string;
  date: string;
  menu: IDish[];
}

export interface MenuByDay {
  menuId: number;
  classId: number;
  date: string;
  dishes: Dish[];
}

export interface MenuEdited {
  message: string;
  menuId: number;
  date: string;
  menu: Dish[];
}

interface SelectedDayMenu {
  date: string;
  menu: MenuResponse | null;
}
