using City_Hall_Management_Project.Data;
using City_Hall_Management_Project.DTOs;
using City_Hall_Management_Project.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace City_Hall_Management_Project.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RequestsController(CityHallDbContext dbContext, UserManager<User> userManager) : ControllerBase
{
    [HttpGet("my")]
    [Authorize(Roles = "Citizen")]
    public async Task<IActionResult> GetMy()
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var profile = await dbContext.CitizenProfiles.FirstOrDefaultAsync(p => p.UserId == user.Id);
        if (profile is null) return NotFound(new { message = "Citizen profile not found." });

        var requests = await dbContext.Requests
            .Where(r => r.CitizenProfileId == profile.Id)
            .Include(r => r.History)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.Title,
                r.Description,
                r.Status,
                r.CreatedAt,
                r.UpdatedAt
            })
            .ToListAsync();

        return Ok(requests);
    }

    [HttpPatch("{id:guid}/cancel")]
    [Authorize(Roles = "Citizen")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var profile = await dbContext.CitizenProfiles.FirstOrDefaultAsync(p => p.UserId == user.Id);
        if (profile is null) return NotFound(new { message = "Citizen profile not found." });

        var request = await dbContext.Requests.FirstOrDefaultAsync(r => r.Id == id);
        if (request is null) return NotFound(new { message = "Request not found." });

        if (request.CitizenProfileId != profile.Id)
            return Forbid();

        if (request.Status != "Submitted")
            return BadRequest(new { message = "Only requests with status 'Submitted' can be cancelled." });

        request.Status = "Cancelled";
        request.UpdatedAt = DateTime.UtcNow;

        dbContext.RequestHistory.Add(new RequestHistory
        {
            RequestId = request.Id,
            ChangedByUserId = user.Id,
            Status = "Cancelled",
            Note = "Cancelled by citizen.",
            ChangedAt = DateTime.UtcNow
        });

        await dbContext.SaveChangesAsync();
        return Ok(new { message = "Request cancelled successfully." });
    }

    [HttpGet]
    [Authorize(Roles = "Employee,Department Manager,System Administrator")]
    public async Task<ActionResult<IEnumerable<Request>>> GetAll()
    {
        var requests = await dbContext.Requests
            .Include(r => r.CitizenProfile)
            .Include(r => r.Department)
            .Include(r => r.History)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return Ok(requests);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Employee,Department Manager,System Administrator")]
    public async Task<ActionResult<Request>> GetById(Guid id)
    {
        var request = await dbContext.Requests
            .Include(r => r.CitizenProfile)
            .Include(r => r.Department)
            .Include(r => r.History)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (request is null)
        {
            return NotFound();
        }

        return Ok(request);
    }

    [HttpPost]
    [Authorize(Roles = "Citizen,System Administrator")]
    public async Task<ActionResult<Request>> Create(CreateRequestDto dto)
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var profile = await dbContext.CitizenProfiles.FirstOrDefaultAsync(p => p.UserId == user.Id);
        if (profile is null) return BadRequest(new { message = "Citizen profile not found." });

        if (dto.DepartmentId.HasValue)
        {
            var departmentExists = await dbContext.Departments.AnyAsync(d => d.Id == dto.DepartmentId.Value);
            if (!departmentExists)
                return BadRequest(new { message = "Department does not exist." });
        }

        var request = new Request
        {
            CitizenProfileId = profile.Id,
            DepartmentId = dto.DepartmentId,
            Title = dto.Title,
            Description = dto.Description,
            Status = "Submitted",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        dbContext.Requests.Add(request);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = request.Id }, request);
    }

    [HttpPut("{id:guid}/status")]
    [Authorize(Roles = "Employee,Department Manager,System Administrator")]
    public async Task<ActionResult<Request>> UpdateStatus(Guid id, UpdateRequestStatusDto dto)
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var request = await dbContext.Requests.FirstOrDefaultAsync(r => r.Id == id);
        if (request is null) return NotFound();

        request.Status = dto.Status;
        request.UpdatedAt = DateTime.UtcNow;

        dbContext.RequestHistory.Add(new RequestHistory
        {
            RequestId = request.Id,
            ChangedByUserId = user.Id,
            Status = dto.Status,
            Note = dto.Note,
            ChangedAt = DateTime.UtcNow
        });

        await dbContext.SaveChangesAsync();

        return Ok(request);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "System Administrator")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var request = await dbContext.Requests.FirstOrDefaultAsync(r => r.Id == id);
        if (request is null)
        {
            return NotFound();
        }

        dbContext.Requests.Remove(request);
        await dbContext.SaveChangesAsync();

        return NoContent();
    }
}
