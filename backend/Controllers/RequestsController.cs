using City_Hall_Management_Project.Data;
using City_Hall_Management_Project.DTOs;
using City_Hall_Management_Project.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace City_Hall_Management_Project.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RequestsController(CityHallDbContext dbContext) : ControllerBase
{
    [HttpGet]
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

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Request>> GetById(int id)
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
    public async Task<ActionResult<Request>> Create(CreateRequestDto dto)
    {
        var citizenExists = await dbContext.CitizenProfiles.AnyAsync(c => c.Id == dto.CitizenProfileId);
        if (!citizenExists)
        {
            return BadRequest("Citizen profile does not exist.");
        }

        if (dto.DepartmentId.HasValue)
        {
            var departmentExists = await dbContext.Departments.AnyAsync(d => d.Id == dto.DepartmentId.Value);
            if (!departmentExists)
            {
                return BadRequest("Department does not exist.");
            }
        }

        var request = new Request
        {
            CitizenProfileId = dto.CitizenProfileId,
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

    [HttpPut("{id:int}/status")]
    public async Task<ActionResult<Request>> UpdateStatus(int id, UpdateRequestStatusDto dto)
    {
        var request = await dbContext.Requests.FirstOrDefaultAsync(r => r.Id == id);
        if (request is null)
        {
            return NotFound();
        }

        var userExists = await dbContext.Users.AnyAsync(u => u.Id == dto.ChangedByUserId);
        if (!userExists)
        {
            return BadRequest("ChangedByUserId does not exist.");
        }

        request.Status = dto.Status;
        request.UpdatedAt = DateTime.UtcNow;

        dbContext.RequestHistory.Add(new RequestHistory
        {
            RequestId = request.Id,
            ChangedByUserId = dto.ChangedByUserId,
            Status = dto.Status,
            Note = dto.Note,
            ChangedAt = DateTime.UtcNow
        });

        await dbContext.SaveChangesAsync();

        return Ok(request);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
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
