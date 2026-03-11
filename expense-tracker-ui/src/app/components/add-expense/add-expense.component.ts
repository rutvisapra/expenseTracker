import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent {
  title = '';
  amount: number = 0;
  category = 'Food';
  date = new Date().toISOString().split('T')[0];
  categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment'];

  constructor(private expenseService: ExpenseService, private router: Router) {}

  onSubmit(): void {
    // Validate form
    if (!this.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (this.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const expense = {
      title: this.title.trim(),
      amount: Number(this.amount),
      category: this.category,
      date: new Date(this.date)
    };

    console.log('Submitting expense:', expense);

    this.expenseService.create(expense).subscribe({
      next: (result) => {
        console.log('Expense created successfully:', result);
        alert('Expense added successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error creating expense:', err);
        alert('Error creating expense: ' + (err.error?.message || err.message || 'Unknown error'));
      }
    });
  }
}
