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
  
  // Math for template
  Math = Math;
  
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
  
  // New features
  remainingBudget = 0;
  budgetPercentage = 0;
  budgetStatus = 'safe'; // safe, warning, exceeded
  monthlySpending: any[] = [];
  categoryStats: any[] = [];
  last30DaysData: any[] = [];
  showNotification = false;
  notificationMessage = '';
  
  // Change Password
  showChangePasswordModal = false;
  oldPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  passwordStrength = 0;
  
  // Import Expenses
  showImportModal = false;
  importFile: File | null = null;
  
  // Expense Goals
  categoryGoals: Map<string, number> = new Map();
  showGoalsModal = false;
  selectedGoalCategory = '';
  goalAmount = 0;
  
  // Recurring Expenses
  showRecurringModal = false;
  recurringExpenses: any[] = [];
  recurringTitle = '';
  recurringAmount = 0;
  recurringCategory = 'Food';
  recurringFrequency = 'monthly'; // monthly, weekly

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
    this.loadGoals();
    this.loadRecurringExpenses();
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
    this.calculateBudgetStats();
    this.calculateCategoryStats();
    this.calculateMonthlySpending();
    this.calculateLast30Days();
    this.checkBudgetNotification();
  }

  calculateBudgetStats(): void {
    this.remainingBudget = Math.max(0, this.monthlyBudget - this.totalExpenses);
    this.budgetPercentage = (this.totalExpenses / this.monthlyBudget) * 100;
    
    if (this.budgetPercentage >= 100) {
      this.budgetStatus = 'exceeded';
    } else if (this.budgetPercentage >= 80) {
      this.budgetStatus = 'warning';
    } else {
      this.budgetStatus = 'safe';
    }
  }

  calculateCategoryStats(): void {
    const categoryMap = new Map<string, { total: number; count: number }>();
    
    this.expenses.forEach(exp => {
      const current = categoryMap.get(exp.category) || { total: 0, count: 0 };
      categoryMap.set(exp.category, {
        total: current.total + exp.amount,
        count: current.count + 1
      });
    });

    this.categoryStats = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      average: (data.total / data.count).toFixed(2),
      percentage: ((data.total / this.totalExpenses) * 100).toFixed(1)
    })).sort((a, b) => b.total - a.total);
  }

  calculateMonthlySpending(): void {
    const monthMap = new Map<string, number>();
    
    this.expenses.forEach(exp => {
      const date = new Date(exp.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const current = monthMap.get(monthKey) || 0;
      monthMap.set(monthKey, current + exp.amount);
    });

    this.monthlySpending = Array.from(monthMap.entries())
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months
  }

  calculateLast30Days(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const dayMap = new Map<string, number>();
    
    this.expenses.forEach(exp => {
      const expDate = new Date(exp.date);
      if (expDate >= thirtyDaysAgo && expDate <= today) {
        const dayKey = expDate.toLocaleDateString();
        const current = dayMap.get(dayKey) || 0;
        dayMap.set(dayKey, current + exp.amount);
      }
    });

    this.last30DaysData = Array.from(dayMap.entries())
      .map(([day, total]) => ({ day, total }))
      .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
  }

  checkBudgetNotification(): void {
    if (this.budgetPercentage >= 100) {
      this.showNotification = true;
      this.notificationMessage = `⚠️ Budget Exceeded! You have spent $${this.totalExpenses.toFixed(2)} of $${this.monthlyBudget}`;
      setTimeout(() => this.showNotification = false, 5000);
    } else if (this.budgetPercentage >= 80) {
      this.showNotification = true;
      this.notificationMessage = `⚠️ Budget Warning! You have used ${this.budgetPercentage.toFixed(0)}% of your budget`;
      setTimeout(() => this.showNotification = false, 5000);
    }
  }

  // Change Password Methods
  validatePasswordStrength(password: string): void {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    this.passwordStrength = strength;
  }

  changePassword(): void {
    if (!this.oldPassword || !this.newPassword || !this.confirmNewPassword) {
      alert('All fields are required');
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      alert('New passwords do not match');
      return;
    }
    if (this.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    this.authService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        alert('Password changed successfully!');
        this.showChangePasswordModal = false;
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
      },
      error: (err) => {
        alert(err.error?.message || 'Error changing password');
      }
    });
  }

  // Import Expenses Methods
  onFileSelected(event: any): void {
    this.importFile = event.target.files[0];
  }

  importExpenses(): void {
    if (!this.importFile) {
      alert('Please select a file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const csv = e.target.result;
      const lines = csv.split('\n');
      let importedCount = 0;

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const [, title, amount, category, date] = lines[i].split(',');
        
        if (!title || !amount || !category || !date) {
          console.warn(`Skipping invalid row: ${i}`);
          continue;
        }

        const expense = {
          title: title.trim(),
          amount: Number(amount),
          category: category.trim(),
          date: new Date(date.trim())
        };

        this.expenseService.create(expense).subscribe({
          next: () => importedCount++,
          error: (err) => console.error('Error importing expense:', err)
        });
      }

      setTimeout(() => {
        alert(`Imported ${importedCount} expenses successfully!`);
        this.showImportModal = false;
        this.importFile = null;
        this.loadExpenses();
      }, 1000);
    };
    reader.readAsText(this.importFile);
  }

  // Expense Goals Methods
  setGoal(): void {
    if (!this.selectedGoalCategory || this.goalAmount <= 0) {
      alert('Please select category and enter valid amount');
      return;
    }
    this.categoryGoals.set(this.selectedGoalCategory, this.goalAmount);
    localStorage.setItem('categoryGoals', JSON.stringify(Array.from(this.categoryGoals.entries())));
    alert(`Goal set for ${this.selectedGoalCategory}: $${this.goalAmount}`);
    this.showGoalsModal = false;
    this.selectedGoalCategory = '';
    this.goalAmount = 0;
  }

  loadGoals(): void {
    const saved = localStorage.getItem('categoryGoals');
    if (saved) {
      this.categoryGoals = new Map(JSON.parse(saved));
    }
  }

  getGoalProgress(category: string): number {
    const goal = this.categoryGoals.get(category);
    if (!goal) return 0;
    
    const spent = this.categoryStats.find(c => c.category === category)?.total || 0;
    return (spent / goal) * 100;
  }

  // Recurring Expenses Methods
  addRecurringExpense(): void {
    if (!this.recurringTitle || this.recurringAmount <= 0) {
      alert('Please enter valid title and amount');
      return;
    }

    const recurring = {
      title: this.recurringTitle,
      amount: this.recurringAmount,
      category: this.recurringCategory,
      frequency: this.recurringFrequency,
      createdDate: new Date()
    };

    this.recurringExpenses.push(recurring);
    localStorage.setItem('recurringExpenses', JSON.stringify(this.recurringExpenses));
    alert('Recurring expense added!');
    this.showRecurringModal = false;
    this.recurringTitle = '';
    this.recurringAmount = 0;
    this.recurringCategory = 'Food';
    this.recurringFrequency = 'monthly';
  }

  loadRecurringExpenses(): void {
    const saved = localStorage.getItem('recurringExpenses');
    if (saved) {
      this.recurringExpenses = JSON.parse(saved);
    }
  }

  deleteRecurringExpense(index: number): void {
    if (confirm('Delete this recurring expense?')) {
      this.recurringExpenses.splice(index, 1);
      localStorage.setItem('recurringExpenses', JSON.stringify(this.recurringExpenses));
    }
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
