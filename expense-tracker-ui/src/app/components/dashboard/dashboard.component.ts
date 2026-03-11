import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ExpenseService } from '../../services/expense.service';
import { AuthService } from '../../services/auth.service';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  totalExpenses = 0;
  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();
  
  // Search & Filter
  searchText = '';
  selectedCategory = '';
  startDate = '';
  endDate = '';
  currentPage = 1;
  pageSize = 10;
  
  // Dark Mode
  isDarkMode = false;
  
  // Budget
  monthlyBudget = 1000;
  budgetExceeded = false;

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
  
  categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment'];

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Dashboard initializing...');
    this.loadExpenses();
    this.loadDarkMode();
    this.loadBudget();
  }

  loadDarkMode(): void {
    const saved = localStorage.getItem('darkMode');
    this.isDarkMode = saved === 'true';
    this.applyDarkMode();
  }

  loadBudget(): void {
    const saved = localStorage.getItem('monthlyBudget');
    if (saved) {
      this.monthlyBudget = Number(saved);
    }
  }

  setBudget(): void {
    const budget = prompt('Enter monthly budget:', this.monthlyBudget.toString());
    if (budget) {
      this.monthlyBudget = Number(budget);
      localStorage.setItem('monthlyBudget', this.monthlyBudget.toString());
      this.checkBudgetAlert();
    }
  }

  checkBudgetAlert(): void {
    this.budgetExceeded = this.totalExpenses > this.monthlyBudget;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.applyDarkMode();
  }

  applyDarkMode(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.filteredExpenses = this.expenses.filter(exp => {
      const matchesSearch = exp.title.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesCategory = !this.selectedCategory || exp.category === this.selectedCategory;
      
      let matchesDateRange = true;
      if (this.startDate || this.endDate) {
        const expDate = new Date(exp.date);
        if (this.startDate) {
          matchesDateRange = expDate >= new Date(this.startDate);
        }
        if (this.endDate && matchesDateRange) {
          matchesDateRange = expDate <= new Date(this.endDate);
        }
      }
      
      return matchesSearch && matchesCategory && matchesDateRange;
    });
  }

  get paginatedExpenses(): Expense[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredExpenses.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredExpenses.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  exportToCSV(): void {
    const headers = ['ID', 'Title', 'Amount', 'Category', 'Date'];
    const rows = this.filteredExpenses.map(exp => [
      exp.id,
      exp.title,
      exp.amount,
      exp.category,
      new Date(exp.date).toLocaleDateString()
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  loadExpenses(): void {
    this.expenseService.getAll().subscribe({
      next: (data) => {
        console.log('Loaded expenses:', data);
        this.expenses = data;
        this.filteredExpenses = data;
        this.totalExpenses = data.reduce((sum, exp) => sum + exp.amount, 0);
        console.log('Total expenses calculated:', this.totalExpenses);
        console.log('Number of expenses:', data.length);
        
        // Update charts with all expenses
        this.updateCharts();
        this.checkBudgetAlert();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading expenses:', err);
        this.expenses = [];
        this.filteredExpenses = [];
        this.totalExpenses = 0;
        this.cdr.detectChanges();
      }
    });
  }

  updateCharts(): void {
    const buildColors = (count: number): string[] => {
      // Simple distinct HSL colors for up to a few dozen slices/bars
      const colors: string[] = [];
      for (let i = 0; i < count; i++) {
        const hue = (i * 360) / Math.max(count, 1);
        colors.push(`hsl(${hue}, 70%, 55%)`);
      }
      return colors;
    };

    // Update pie chart with all expenses grouped by category
    const categoryMap = new Map<string, number>();
    this.expenses.forEach(exp => {
      const current = categoryMap.get(exp.category) || 0;
      categoryMap.set(exp.category, current + exp.amount);
    });

    if (categoryMap.size > 0) {
      const labels = Array.from(categoryMap.keys());
      const values = Array.from(categoryMap.values());
      this.pieChartData = {
        labels,
        datasets: [{
          data: values,
          backgroundColor: buildColors(values.length)
        }]
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
      const labels = Array.from(dailyMap.keys());
      const values = Array.from(dailyMap.values());
      this.barChartData = {
        labels,
        datasets: [{
          data: values,
          label: 'Daily Expenses',
          backgroundColor: buildColors(values.length)
        }]
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

  editExpense(expense: Expense): void {
    const title = prompt('Enter new title:', expense.title);
    if (!title) return;
    
    const amount = prompt('Enter new amount:', expense.amount.toString());
    if (!amount) return;
    
    const category = prompt('Enter category (Food/Travel/Bills/Shopping/Entertainment):', expense.category);
    if (!category) return;
    
    const updatedExpense = {
      title: title.trim(),
      amount: Number(amount),
      category,
      date: new Date(expense.date)
    };
    
    this.expenseService.update(expense.id, updatedExpense).subscribe({
      next: () => {
        alert('Expense updated successfully!');
        this.loadExpenses();
      },
      error: (err) => {
        console.error('Error updating expense:', err);
        alert('Error updating expense');
      }
    });
  }
}
