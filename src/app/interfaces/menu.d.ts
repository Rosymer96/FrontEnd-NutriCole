import { IDish } from "./dish";

export interface MenuByMonthResponse {
  message: string;
  classId: string | number;
  dateRange: { start: string; end: string };
  menus: MenuResponse[];
}

export interface MenuResponse {
  date: string;
  dishes: IDish[];
}
interface SelectedDayMenu {
  date: string;
  menu: MenuResponse | null;
}
