import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardTutorService {
  URL = '/api/class/list';

  private http = inject(HttpClient);

  getClasses() {
    return this.http.get(this.URL)
  }
}
