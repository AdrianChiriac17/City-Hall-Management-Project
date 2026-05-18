using City_Hall_Management_Project.Data;
using City_Hall_Management_Project.DTOs.Announcements;
using City_Hall_Management_Project.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace City_Hall_Management_Project.Controllers;

[ApiController]
[Route("api/announcements")]
[Authorize]
public class AnnouncementsController(
    CityHallDbContext dbContext,
    UserManager<User> userManager) : ControllerBase
{
    // ── GET /api/announcements?search=&importantOnly=false&page=1&pageSize=20 ──
    [HttpGet]
    public async Task<IActionResult> GetAll(
        string? search = null,
        bool importantOnly = false,
        int page = 1,
        int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize is < 1 or > 100) pageSize = 20;

        var query = dbContext.Announcements.Include(a => a.Author).AsQueryable();

        if (importantOnly)
            query = query.Where(a => a.IsImportant);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(a => a.Title.Contains(term) || a.Content.Contains(term));
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new AnnouncementDto
            {
                Id = a.Id,
                Title = a.Title,
                Content = a.Content,
                IsImportant = a.IsImportant,
                AuthorName = $"{a.Author!.FirstName} {a.Author.LastName}",
                AuthorUserId = a.AuthorUserId,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            items,
            totalCount,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
            hasPreviousPage = page > 1,
            hasNextPage = page * pageSize < totalCount
        });
    }

    // ── GET /api/announcements/{id} ───────────────────────────────────────────
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var a = await dbContext.Announcements
            .Include(x => x.Author)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (a is null) return NotFound();

        return Ok(new AnnouncementDto
        {
            Id = a.Id,
            Title = a.Title,
            Content = a.Content,
            IsImportant = a.IsImportant,
            AuthorName = $"{a.Author!.FirstName} {a.Author.LastName}",
            AuthorUserId = a.AuthorUserId,
            CreatedAt = a.CreatedAt,
            UpdatedAt = a.UpdatedAt
        });
    }

    // ── POST /api/announcements ────────────────────────────────────────────────
    [HttpPost]
    [Authorize(Roles = "System Administrator,Department Manager,Employee")]
    public async Task<IActionResult> Create([FromBody] CreateAnnouncementDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var announcement = new Announcement
        {
            Id = Guid.NewGuid(),
            Title = dto.Title.Trim(),
            Content = dto.Content.Trim(),
            IsImportant = dto.IsImportant,
            AuthorUserId = user.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        dbContext.Announcements.Add(announcement);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = announcement.Id }, new AnnouncementDto
        {
            Id = announcement.Id,
            Title = announcement.Title,
            Content = announcement.Content,
            IsImportant = announcement.IsImportant,
            AuthorName = $"{user.FirstName} {user.LastName}",
            AuthorUserId = announcement.AuthorUserId,
            CreatedAt = announcement.CreatedAt,
            UpdatedAt = announcement.UpdatedAt
        });
    }

    // ── PUT /api/announcements/{id} ───────────────────────────────────────────
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAnnouncementDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var announcement = await dbContext.Announcements.FindAsync(id);
        if (announcement is null) return NotFound();

        var isAdmin = User.IsInRole("System Administrator");
        if (announcement.AuthorUserId != user.Id && !isAdmin) return Forbid();

        announcement.Title = dto.Title.Trim();
        announcement.Content = dto.Content.Trim();
        announcement.IsImportant = dto.IsImportant;
        announcement.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    // ── DELETE /api/announcements/{id} ───────────────────────────────────────
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var announcement = await dbContext.Announcements.FindAsync(id);
        if (announcement is null) return NotFound();

        var isAdmin = User.IsInRole("System Administrator");
        if (announcement.AuthorUserId != user.Id && !isAdmin) return Forbid();

        dbContext.Announcements.Remove(announcement);
        await dbContext.SaveChangesAsync();

        return NoContent();
    }
}
