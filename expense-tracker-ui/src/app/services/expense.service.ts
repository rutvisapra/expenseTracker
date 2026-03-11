import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Expense, CreateExpense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:5058/api/expenses';

  constructor(private http: HttpClient) {}

  /** Emits whenever expenses are created/updated/deleted. */
  readonly changed$ = new Subject<void>();

  getAll(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  getById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  create(expense: CreateExpense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense).pipe(
      tap(() => this.changed$.next())
    );
  }

  update(id: number, expense: CreateExpense): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, expense).pipe(
      tap(() => this.changed$.next())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.changed$.next())
    );
  }
}
