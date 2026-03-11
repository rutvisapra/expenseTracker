using ExpenseTracker.API.Data;
using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Services;

public class ExpenseService : IExpenseService
{
    private readonly AppDbContext _context;

    public ExpenseService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ExpenseDto>> GetAllExpenses(int userId)
    {
        return await _context.Expenses
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.Date)
            .Select(e => new ExpenseDto
            {
                Id = e.Id,
                Title = e.Title,
                Amount = e.Amount,
                Category = e.Category,
                Date = e.Date
            })
            .ToListAsync();
    }

    public async Task<ExpenseDto?> GetExpenseById(int id, int userId)
    {
        var expense = await _context.Expenses
            .Where(e => e.Id == id && e.UserId == userId)
            .Select(e => new ExpenseDto
            {
                Id = e.Id,
                Title = e.Title,
                Amount = e.Amount,
                Category = e.Category,
                Date = e.Date
            })
            .FirstOrDefaultAsync();

        return expense;
    }

    public async Task<ExpenseDto> CreateExpense(CreateExpenseDto dto, int userId)
    {
        try
        {
            var expense = new Expense
            {
                Title = dto.Title,
                Amount = dto.Amount,
                Category = dto.Category,
                Date = dto.Date,
                UserId = userId
            };

            Console.WriteLine($"Creating expense: Title={expense.Title}, Amount={expense.Amount}, Category={expense.Category}, Date={expense.Date}, UserId={expense.UserId}");

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Expense created successfully with ID: {expense.Id}");

            return new ExpenseDto
            {
                Id = expense.Id,
                Title = expense.Title,
                Amount = expense.Amount,
                Category = expense.Category,
                Date = expense.Date
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error creating expense: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> UpdateExpense(int id, CreateExpenseDto dto, int userId)
    {
        var expense = await _context.Expenses
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (expense == null)
            return false;

        expense.Title = dto.Title;
        expense.Amount = dto.Amount;
        expense.Category = dto.Category;
        expense.Date = dto.Date;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteExpense(int id, int userId)
    {
        var expense = await _context.Expenses
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (expense == null)
            return false;

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();
        return true;
    }
}
