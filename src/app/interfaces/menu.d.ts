export interface MenuByMonthResponse {
  message: string;
  classId: string | number;
  dateRange: { start: string; end: string };
  menus: MenuResponse[];
}

export interface MenuResponse {
  date: string;
  dishes: string[];
}

export interface MenuByDay {
  menuId: number;
  classId: number;
  date: string;
  dishes: Dish[];
}
