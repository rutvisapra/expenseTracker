namespace ExpenseTracker.API.Services;

public interface IAnalyticsService
{
    Task<object> GetMonthlyAnalytics(int userId, int year, int month);
    Task<object> GetCategoryAnalytics(int userId, int year, int month);
}
