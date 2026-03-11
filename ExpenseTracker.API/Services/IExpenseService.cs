using ExpenseTracker.API.DTOs;

namespace ExpenseTracker.API.Services;

public interface IExpenseService
{
    Task<IEnumerable<ExpenseDto>> GetAllExpenses(int userId);
    Task<ExpenseDto?> GetExpenseById(int id, int userId);
    Task<ExpenseDto> CreateExpense(CreateExpenseDto dto, int userId);
    Task<bool> UpdateExpense(int id, CreateExpenseDto dto, int userId);
    Task<bool> DeleteExpense(int id, int userId);
}
