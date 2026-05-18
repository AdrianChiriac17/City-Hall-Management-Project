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
public class RequestsController(
    CityHallDbContext dbContext,
    UserManager<User> userManager) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Employee,Department Manager,System Administrator")]
    public async Task<ActionResult<IEnumerable<Request>>> GetAll()
    {
        var requests = await dbContext.Requests
            .Include(r => r.CitizenProfile).ThenInclude(cp => cp!.User)
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
            .Include(r => r.CitizenProfile).ThenInclude(cp => cp!.User)
            .Include(r => r.Department)
            .Include(r => r.History)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (request is null)
            return NotFound();

        return Ok(request);
    }

    [HttpGet("my")]
    [Authorize(Roles = "Citizen")]
    public async Task<ActionResult<IEnumerable<Request>>> GetMyCitizenRequests()
    {
        var profileId = await ResolveProfileIdAsync();
        if (profileId is null)
            return NotFound(new { message = "Citizen profile not found." });

        var requests = await dbContext.Requests
            .Include(r => r.Department)
            .Include(r => r.History)
            .Where(r => r.CitizenProfileId == profileId.Value)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return Ok(requests);
    }

    [HttpPost]
    [Authorize(Roles = "Citizen,System Administrator")]
    public async Task<ActionResult<Request>> Create(CreateRequestDto dto)
    {
        var citizenExists = await dbContext.CitizenProfiles.AnyAsync(c => c.Id == dto.CitizenProfileId);
        if (!citizenExists)
            return BadRequest("Citizen profile does not exist.");

        if (dto.DepartmentId.HasValue)
        {
            var departmentExists = await dbContext.Departments.AnyAsync(d => d.Id == dto.DepartmentId.Value);
            if (!departmentExists)
                return BadRequest("Department does not exist.");
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

    [HttpPost("my")]
    [Authorize(Roles = "Citizen")]
    public async Task<ActionResult<Request>> CreateMyCitizenRequest(CreateMyRequestDto dto)
    {
        var profileId = await ResolveProfileIdAsync();
        if (profileId is null)
            return NotFound(new { message = "Citizen profile not found." });

        var request = new Request
        {
            CitizenProfileId = profileId.Value,
            Title = dto.Title,
            Description = dto.Description,
            Status = "Submitted",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        dbContext.Requests.Add(request);
        await dbContext.SaveChangesAsync();

        return Created(string.Empty, request);
    }

    [HttpPatch("my/{id:guid}")]
    [Authorize(Roles = "Citizen")]
    public async Task<ActionResult<Request>> UpdateMyCitizenRequest(Guid id, UpdateMyRequestDto dto)
    {
        var profileId = await ResolveProfileIdAsync();
        if (profileId is null)
            return NotFound(new { message = "Citizen profile not found." });

        var request = await dbContext.Requests
            .FirstOrDefaultAsync(r => r.Id == id && r.CitizenProfileId == profileId.Value);

        if (request is null)
            return NotFound();

        if (request.Status != "Submitted")
            return BadRequest(new { message = "Only 'Submitted' requests can be edited." });

        request.Title = dto.Title.Trim();
        request.Description = dto.Description.Trim();
        request.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync();

        return Ok(request);
    }

    [HttpDelete("my/{id:guid}")]
    [Authorize(Roles = "Citizen")]
    public async Task<IActionResult> CancelMyCitizenRequest(Guid id)
    {
        var profileId = await ResolveProfileIdAsync();
        if (profileId is null)
            return NotFound(new { message = "Citizen profile not found." });

        var request = await dbContext.Requests
            .FirstOrDefaultAsync(r => r.Id == id && r.CitizenProfileId == profileId.Value);

        if (request is null)
            return NotFound();

        if (request.Status != "Submitted")
            return BadRequest(new { message = "Only 'Submitted' requests can be cancelled." });

        dbContext.Requests.Remove(request);
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id:guid}/status")]
    [Authorize(Roles = "Employee,Department Manager,System Administrator")]
    public async Task<ActionResult<Request>> UpdateStatus(Guid id, UpdateRequestStatusDto dto)
    {
        var request = await dbContext.Requests.FirstOrDefaultAsync(r => r.Id == id);
        if (request is null)
            return NotFound();

        var userExists = await dbContext.Users.AnyAsync(u => u.Id == dto.ChangedByUserId);
        if (!userExists)
            return BadRequest("ChangedByUserId does not exist.");

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

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "System Administrator")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var request = await dbContext.Requests.FirstOrDefaultAsync(r => r.Id == id);
        if (request is null)
            return NotFound();

        dbContext.Requests.Remove(request);
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    private async Task<Guid?> ResolveProfileIdAsync()
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return null;

        var profile = await dbContext.CitizenProfiles
            .FirstOrDefaultAsync(p => p.UserId == user.Id);

        return profile?.Id;
    }
}
