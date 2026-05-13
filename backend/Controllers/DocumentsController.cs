using City_Hall_Management_Project.Data;
using City_Hall_Management_Project.DTOs.Documents;
using City_Hall_Management_Project.Models;
using City_Hall_Management_Project.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace City_Hall_Management_Project.Controllers;

[ApiController]
[Route("api/my-documents")]
[Authorize]
public class DocumentsController(
    IDocumentService documentService,
    UserManager<User> userManager,
    CityHallDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyDocuments(CancellationToken ct)
    {
        var citizenProfileId = await ResolveProfileIdAsync();
        if (citizenProfileId is null)
            return NotFound(new { message = "Citizen profile not found for this account." });

        var docs = await documentService.GetMyDocumentsAsync(citizenProfileId.Value, ct);
        return Ok(docs);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetMyDocument(Guid id, CancellationToken ct)
    {
        var citizenProfileId = await ResolveProfileIdAsync();
        if (citizenProfileId is null)
            return NotFound(new { message = "Citizen profile not found for this account." });

        var doc = await documentService.GetMyDocumentByIdAsync(id, citizenProfileId.Value, ct);
        if (doc is null) return NotFound();

        return Ok(doc);
    }

    [HttpPost]
    public async Task<IActionResult> UploadDocument([FromForm] UploadDocumentRequestDto dto, CancellationToken ct)
    {
        var citizenProfileId = await ResolveProfileIdAsync();
        if (citizenProfileId is null)
            return NotFound(new { message = "Citizen profile not found for this account." });

        try
        {
            var doc = await documentService.UploadDocumentAsync(citizenProfileId.Value, dto, Request, ct);
            return CreatedAtAction(nameof(GetMyDocument), new { id = doc.Id }, doc);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteDocument(Guid id, CancellationToken ct)
    {
        var citizenProfileId = await ResolveProfileIdAsync();
        if (citizenProfileId is null)
            return NotFound(new { message = "Citizen profile not found for this account." });

        try
        {
            var deleted = await documentService.DeleteDocumentAsync(id, citizenProfileId.Value, ct);
            if (!deleted) return NotFound();
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
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
