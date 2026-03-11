import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ExpenseService } from '../../services/expense.service';
import { AnalyticsService } from '../../services/analytics.service';
import { AuthService } from '../../services/auth.service';
import { Expense } from '../../models/expense.model';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
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

  private routerSubscription?: Subscription;

  constructor(
    private expenseService: ExpenseService,
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Dashboard initializing...');
    console.log('Current date filter - Year:', this.currentYear, 'Month:', this.currentMonth);
    this.loadExpenses();

    // Ensure dashboard refreshes when navigated back to
    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event.urlAfterRedirects.includes('/dashboard')) {
          this.loadExpenses();
        }
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  loadExpenses(): void {
    this.expenseService.getAll().subscribe({
      next: (data) => {
        console.log('Loaded expenses:', data);
        this.expenses = data;
        this.totalExpenses = data.reduce((sum, exp) => sum + exp.amount, 0);
        console.log('Total expenses calculated:', this.totalExpenses);
        console.log('Number of expenses:', data.length);
        this.loadAnalytics(); // Reload analytics when expenses change
      },
      error: (err) => {
        console.error('Error loading expenses:', err);
        this.expenses = [];
        this.totalExpenses = 0;
      }
    });
  }

  loadAnalytics(): void {
    console.log('Loading analytics for:', this.currentYear, this.currentMonth);
    
    this.analyticsService.getCategory(this.currentYear, this.currentMonth).subscribe({
      next: (data: any) => {
        console.log('Category analytics data:', data);
        if (data && data.length > 0) {
          this.pieChartData = {
            labels: data.map((d: any) => d.category),
            datasets: [{ data: data.map((d: any) => d.total) }]
          };
        } else {
          // If no data for current month, show message
          this.pieChartData = {
            labels: ['No Data for Current Month'],
            datasets: [{ data: [1] }]
          };
        }
      },
      error: (err) => {
        console.error('Analytics error:', err);
        this.pieChartData = {
          labels: ['Error Loading Data'],
          datasets: [{ data: [1] }]
        };
      }
    });

    this.analyticsService.getMonthly(this.currentYear, this.currentMonth).subscribe({
      next: (data: any) => {
        console.log('Monthly analytics data:', data);
        if (data && data.dailyExpenses && data.dailyExpenses.length > 0) {
          this.barChartData = {
            labels: data.dailyExpenses.map((d: any) => `Day ${d.day}`),
            datasets: [{ data: data.dailyExpenses.map((d: any) => d.total), label: 'Daily Expenses' }]
          };
        } else {
          this.barChartData = {
            labels: ['No Data for Current Month'],
            datasets: [{ data: [0], label: 'Daily Expenses' }]
          };
        }
      },
      error: (err) => {
        console.error('Monthly analytics error:', err);
        this.barChartData = {
          labels: ['Error Loading Data'],
          datasets: [{ data: [0], label: 'Daily Expenses' }]
        };
      }
    });
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
