import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:5058/api/analytics';

  constructor(private http: HttpClient) {}

  getMonthly(year: number, month: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/monthly?year=${year}&month=${month}`);
  }

  getCategory(year: number, month: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/category?year=${year}&month=${month}`);
  }
}
