using ExpenseTracker.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExpenseTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("monthly")]
    public async Task<IActionResult> GetMonthly([FromQuery] int year, [FromQuery] int month)
    {
        var analytics = await _analyticsService.GetMonthlyAnalytics(GetUserId(), year, month);
        return Ok(analytics);
    }

    [HttpGet("category")]
    public async Task<IActionResult> GetCategory([FromQuery] int year, [FromQuery] int month)
    {
        var analytics = await _analyticsService.GetCategoryAnalytics(GetUserId(), year, month);
        return Ok(analytics);
    }
}
