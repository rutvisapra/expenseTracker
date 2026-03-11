using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExpenseTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExpensesController : ControllerBase
{
    private readonly IExpenseService _expenseService;

    public ExpensesController(IExpenseService expenseService)
    {
        _expenseService = expenseService;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var expenses = await _expenseService.GetAllExpenses(GetUserId());
        return Ok(expenses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var expense = await _expenseService.GetExpenseById(id, GetUserId());
        if (expense == null)
            return NotFound();

        return Ok(expense);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateExpenseDto dto)
    {
        try
        {
            Console.WriteLine($"Received expense creation request: {dto.Title}, {dto.Amount}, {dto.Category}, {dto.Date}");
            Console.WriteLine($"User ID from token: {GetUserId()}");
            
            var expense = await _expenseService.CreateExpense(dto, GetUserId());
            return CreatedAtAction(nameof(GetById), new { id = expense.Id }, expense);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in Create endpoint: {ex.Message}");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateExpenseDto dto)
    {
        var result = await _expenseService.UpdateExpense(id, dto, GetUserId());
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _expenseService.DeleteExpense(id, GetUserId());
        if (!result)
            return NotFound();

        return NoContent();
    }
}
