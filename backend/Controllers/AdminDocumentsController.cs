using City_Hall_Management_Project.DTOs.Documents;
using City_Hall_Management_Project.Models;
using City_Hall_Management_Project.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace City_Hall_Management_Project.Controllers;

[ApiController]
[Route("api/admin/documents")]
[Authorize(Roles = "System Administrator")]
public class AdminDocumentsController(
    IDocumentService documentService,
    UserManager<User> userManager) : ControllerBase
{
    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingDocuments(CancellationToken ct)
    {
        var docs = await documentService.GetPendingDocumentsAsync(ct);
        return Ok(docs);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetDocumentForReview(Guid id, CancellationToken ct)
    {
        var doc = await documentService.GetDocumentForReviewAsync(id, ct);
        if (doc is null) return NotFound();
        return Ok(doc);
    }

    [HttpPost("{id:guid}/review")]
    public async Task<IActionResult> ReviewDocument(Guid id, [FromBody] ReviewDocumentRequestDto dto, CancellationToken ct)
    {
        var reviewer = await userManager.GetUserAsync(User);
        if (reviewer is null) return Unauthorized();

        try
        {
            var doc = await documentService.ReviewDocumentAsync(id, reviewer.Id, dto, ct);
            if (doc is null) return NotFound();
            return Ok(doc);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
