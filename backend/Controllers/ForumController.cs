using City_Hall_Management_Project.Data;
using City_Hall_Management_Project.DTOs.Forum;
using City_Hall_Management_Project.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace City_Hall_Management_Project.Controllers;

[ApiController]
[Route("api/forum")]
[Authorize]
public class ForumController(
    CityHallDbContext dbContext,
    UserManager<User> userManager,
    IWebHostEnvironment env) : ControllerBase
{
    private static readonly HashSet<string> AllowedContentTypes =
        ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

    private static readonly HashSet<string> AllowedExtensions =
        [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    private const long MaxFileSizeBytes = 5 * 1024 * 1024;

    // ── GET /api/forum/threads?page=1&pageSize=20 ──────────────────────────
    [HttpGet("threads")]
    public async Task<IActionResult> GetThreads(int page = 1, int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize is < 1 or > 100) pageSize = 20;

        var totalCount = await dbContext.ForumThreads.CountAsync();

        var items = await dbContext.ForumThreads
            .Include(t => t.Author)
            .OrderByDescending(t => t.UpdatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new ForumThreadListItemDto
            {
                Id = t.Id,
                Title = t.Title,
                AuthorName = $"{t.Author!.FirstName} {t.Author.LastName}",
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                ReplyCount = t.Posts.Count,
                IsClosed = t.IsClosed
            })
            .ToListAsync();

        return Ok(new PagedResult<ForumThreadListItemDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        });
    }

    // ── GET /api/forum/threads/{id} ────────────────────────────────────────
    [HttpGet("threads/{id:guid}")]
    public async Task<IActionResult> GetThread(Guid id)
    {
        var thread = await dbContext.ForumThreads
            .Include(t => t.Author)
            .Include(t => t.Attachments)
            .Include(t => t.Posts.OrderBy(p => p.CreatedAt))
                .ThenInclude(p => p.Author)
            .Include(t => t.Posts)
                .ThenInclude(p => p.Attachments)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (thread is null) return NotFound(new { message = "Thread not found." });

        return Ok(MapThreadDetail(thread));
    }

    // ── POST /api/forum/threads ────────────────────────────────────────────
    [HttpPost("threads")]
    public async Task<IActionResult> CreateThread([FromBody] CreateThreadDto dto)
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var now = DateTime.UtcNow;
        var thread = new ForumThread
        {
            Title = dto.Title.Trim(),
            Content = dto.Content.Trim(),
            AuthorUserId = user.Id,
            CreatedAt = now,
            UpdatedAt = now
        };

        dbContext.ForumThreads.Add(thread);
        await dbContext.SaveChangesAsync();

        await dbContext.Entry(thread).Reference(t => t.Author).LoadAsync();

        return CreatedAtAction(nameof(GetThread), new { id = thread.Id }, MapThreadDetail(thread));
    }

    // ── POST /api/forum/threads/{id}/posts ────────────────────────────────
    [HttpPost("threads/{id:guid}/posts")]
    public async Task<IActionResult> CreatePost(Guid id, [FromBody] CreatePostDto dto)
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var thread = await dbContext.ForumThreads.FindAsync(id);
        if (thread is null) return NotFound(new { message = "Thread not found." });
        if (thread.IsClosed) return BadRequest(new { message = "This thread is closed." });

        var now = DateTime.UtcNow;
        var post = new ForumPost
        {
            ThreadId = id,
            AuthorUserId = user.Id,
            Content = dto.Content.Trim(),
            CreatedAt = now,
            UpdatedAt = now
        };

        thread.UpdatedAt = now;
        dbContext.ForumPosts.Add(post);
        await dbContext.SaveChangesAsync();

        return Ok(new ForumPostDto
        {
            Id = post.Id,
            Content = post.Content,
            AuthorName = $"{user.FirstName} {user.LastName}",
            AuthorId = user.Id,
            CreatedAt = post.CreatedAt,
            UpdatedAt = post.UpdatedAt,
            Attachments = []
        });
    }

    // ── POST /api/forum/threads/{id}/attachments ───────────────────────────
    [HttpPost("threads/{id:guid}/attachments")]
    public async Task<IActionResult> UploadThreadAttachment(Guid id, IFormFile file)
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var thread = await dbContext.ForumThreads.FindAsync(id);
        if (thread is null) return NotFound(new { message = "Thread not found." });
        if (thread.AuthorUserId != user.Id) return Forbid();

        var validationError = ValidateFile(file);
        if (validationError is not null) return BadRequest(new { message = validationError });

        var attachment = await SaveAttachmentAsync(file);
        attachment.ThreadId = id;

        dbContext.ForumAttachments.Add(attachment);
        await dbContext.SaveChangesAsync();

        return Ok(MapAttachment(attachment));
    }

    // ── POST /api/forum/posts/{id}/attachments ─────────────────────────────
    [HttpPost("posts/{id:guid}/attachments")]
    public async Task<IActionResult> UploadPostAttachment(Guid id, IFormFile file)
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var post = await dbContext.ForumPosts.FindAsync(id);
        if (post is null) return NotFound(new { message = "Post not found." });
        if (post.AuthorUserId != user.Id) return Forbid();

        var validationError = ValidateFile(file);
        if (validationError is not null) return BadRequest(new { message = validationError });

        var attachment = await SaveAttachmentAsync(file);
        attachment.PostId = id;

        dbContext.ForumAttachments.Add(attachment);
        await dbContext.SaveChangesAsync();

        return Ok(MapAttachment(attachment));
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private string? ValidateFile(IFormFile? file)
    {
        if (file is null || file.Length == 0) return "No file provided.";
        if (file.Length > MaxFileSizeBytes) return "File size exceeds the 5 MB limit.";
        if (!AllowedContentTypes.Contains(file.ContentType.ToLowerInvariant()))
            return "Only JPEG, PNG, GIF, and WebP images are allowed.";

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            return "Invalid file extension.";

        return null;
    }

    private async Task<ForumAttachment> SaveAttachmentAsync(IFormFile file)
    {
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        var storedFileName = $"{Guid.NewGuid()}{ext}";
        var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "uploads", "forum");
        Directory.CreateDirectory(uploadsDir);

        var fullPath = Path.Combine(uploadsDir, storedFileName);
        await using var stream = System.IO.File.Create(fullPath);
        await file.CopyToAsync(stream);

        return new ForumAttachment
        {
            OriginalFileName = Path.GetFileName(file.FileName),
            StoredFileName = storedFileName,
            StoragePath = $"/uploads/forum/{storedFileName}",
            ContentType = file.ContentType.ToLowerInvariant(),
            FileSizeBytes = file.Length,
            UploadedAt = DateTime.UtcNow
        };
    }

    private ForumAttachmentDto MapAttachment(ForumAttachment a) => new()
    {
        Id = a.Id,
        OriginalFileName = a.OriginalFileName,
        Url = $"{Request.Scheme}://{Request.Host}{a.StoragePath}",
        ContentType = a.ContentType,
        FileSizeBytes = a.FileSizeBytes
    };

    private ForumThreadDetailDto MapThreadDetail(ForumThread t) => new()
    {
        Id = t.Id,
        Title = t.Title,
        Content = t.Content,
        AuthorName = t.Author is not null ? $"{t.Author.FirstName} {t.Author.LastName}" : "Unknown",
        AuthorId = t.AuthorUserId,
        CreatedAt = t.CreatedAt,
        UpdatedAt = t.UpdatedAt,
        IsClosed = t.IsClosed,
        Attachments = t.Attachments.Select(MapAttachment).ToList(),
        Posts = t.Posts.Select(p => new ForumPostDto
        {
            Id = p.Id,
            Content = p.Content,
            AuthorName = p.Author is not null ? $"{p.Author.FirstName} {p.Author.LastName}" : "Unknown",
            AuthorId = p.AuthorUserId,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt,
            Attachments = p.Attachments.Select(MapAttachment).ToList()
        }).ToList()
    };
}
