export interface MenuByMonthResponse {
  message: string;
  classId: string | string;
  dateRange: { start: string; end: string };
  classId: string;
  menus: MenuResponse[];
}

export interface MenuResponse {
  date: string;
  dishes: string[];
}
