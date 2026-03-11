using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        try
        {
            var token = await _authService.Register(dto);
            if (token == null)
                return BadRequest(new { message = "Email already exists" });

            return Ok(new { token });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Registration failed: " + ex.Message });
        }
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        try
        {
            var token = await _authService.Login(dto);
            if (token == null)
                return Unauthorized(new { message = "Invalid credentials" });

            return Ok(new { token });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Login failed: " + ex.Message });
        }
    }
}
