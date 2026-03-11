using ExpenseTracker.API.DTOs;

namespace ExpenseTracker.API.Services;

public interface IAuthService
{
    Task<string?> Register(RegisterDto dto);
    Task<string?> Login(LoginDto dto);
}
