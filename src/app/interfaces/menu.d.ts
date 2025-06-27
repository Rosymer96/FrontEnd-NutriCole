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
interface SelectedDayMenu {
  date: string;
  menu: MenuResponse | null;
}
