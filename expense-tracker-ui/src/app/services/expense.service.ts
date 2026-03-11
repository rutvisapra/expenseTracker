import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense, CreateExpense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:5058/api/expenses';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  getById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  create(expense: CreateExpense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  update(id: number, expense: CreateExpense): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, expense);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
