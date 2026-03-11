using ExpenseTracker.API.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly AppDbContext _context;

    public AnalyticsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<object> GetMonthlyAnalytics(int userId, int year, int month)
    {
        var startDate = new DateTime(year, month, 1);
        var endDate = startDate.AddMonths(1);

        try
        {
            var dailyExpenses = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date >= startDate && e.Date < endDate)
                .GroupBy(e => e.Date.Day)
                .Select(g => new
                {
                    Day = g.Key,
                    Total = g.Sum(e => e.Amount)
                })
                .OrderBy(x => x.Day)
                .ToListAsync();

            var totalExpenses = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date >= startDate && e.Date < endDate)
                .SumAsync(e => e.Amount);

            return new
            {
                DailyExpenses = dailyExpenses,
                TotalExpenses = totalExpenses,
                Month = month,
                Year = year
            };
        }
        catch
        {
            return new
            {
                DailyExpenses = new List<object>(),
                TotalExpenses = 0,
                Month = month,
                Year = year
            };
        }
    }

    public async Task<object> GetCategoryAnalytics(int userId, int year, int month)
    {
        var startDate = new DateTime(year, month, 1);
        var endDate = startDate.AddMonths(1);

        try
        {
            var categoryExpenses = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date >= startDate && e.Date < endDate)
                .GroupBy(e => e.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Total = g.Sum(e => e.Amount),
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Total)
                .ToListAsync();

            return categoryExpenses;
        }
        catch
        {
            return new List<object>();
        }
    }
}
