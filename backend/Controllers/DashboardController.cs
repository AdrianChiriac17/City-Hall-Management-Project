using City_Hall_Management_Project.Data;
using City_Hall_Management_Project.DTOs.Announcements;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace City_Hall_Management_Project.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController(CityHallDbContext dbContext) : ControllerBase
{
    // ── GET /api/dashboard/stats ──────────────────────────────────────────────
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var citizenCount = await dbContext.CitizenProfiles.CountAsync();
        var requestCount = await dbContext.Requests.CountAsync();
        var documentCount = await dbContext.Documents.CountAsync();
        var announcementCount = await dbContext.Announcements.CountAsync();

        return Ok(new
        {
            citizenCount,
            requestCount,
            documentCount,
            announcementCount
        });
    }

    // ── GET /api/dashboard/recent-announcements ───────────────────────────────
    [HttpGet("recent-announcements")]
    public async Task<IActionResult> GetRecentAnnouncements()
    {
        var items = await dbContext.Announcements
            .Include(a => a.Author)
            .OrderByDescending(a => a.CreatedAt)
            .Take(5)
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

        return Ok(items);
    }
}
