import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ExpenseService } from '../../services/expense.service';
import { AuthService } from '../../services/auth.service';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];
  totalExpenses = 0;
  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: [] }]
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Daily Expenses' }]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = { responsive: true };
  barChartOptions: ChartConfiguration<'bar'>['options'] = { responsive: true };

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Dashboard initializing...');
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenseService.getAll().subscribe({
      next: (data) => {
        console.log('Loaded expenses:', data);
        this.expenses = data;
        this.totalExpenses = data.reduce((sum, exp) => sum + exp.amount, 0);
        console.log('Total expenses calculated:', this.totalExpenses);
        console.log('Number of expenses:', data.length);
        
        // Update charts with all expenses
        this.updateCharts();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading expenses:', err);
        this.expenses = [];
        this.totalExpenses = 0;
        this.cdr.detectChanges();
      }
    });
  }

  updateCharts(): void {
    // Update pie chart with all expenses grouped by category
    const categoryMap = new Map<string, number>();
    this.expenses.forEach(exp => {
      const current = categoryMap.get(exp.category) || 0;
      categoryMap.set(exp.category, current + exp.amount);
    });

    if (categoryMap.size > 0) {
      this.pieChartData = {
        labels: Array.from(categoryMap.keys()),
        datasets: [{ data: Array.from(categoryMap.values()) }]
      };
      console.log('Pie chart updated:', this.pieChartData);
    } else {
      this.pieChartData = {
        labels: ['No Data'],
        datasets: [{ data: [1] }]
      };
    }

    // Update bar chart with daily expenses
    const dailyMap = new Map<string, number>();
    this.expenses.forEach(exp => {
      const dateStr = new Date(exp.date).toLocaleDateString();
      const current = dailyMap.get(dateStr) || 0;
      dailyMap.set(dateStr, current + exp.amount);
    });

    if (dailyMap.size > 0) {
      this.barChartData = {
        labels: Array.from(dailyMap.keys()),
        datasets: [{ data: Array.from(dailyMap.values()), label: 'Daily Expenses' }]
      };
      console.log('Bar chart updated:', this.barChartData);
    } else {
      this.barChartData = {
        labels: ['No Data'],
        datasets: [{ data: [0], label: 'Daily Expenses' }]
      };
    }

    this.cdr.detectChanges();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  deleteExpense(id: number): void {
    if (confirm('Are you sure?')) {
      this.expenseService.delete(id).subscribe({
        next: () => this.loadExpenses(),
        error: (err) => console.error('Error deleting expense:', err)
      });
    }
  }
}
