using City_Hall_Management_Project.Data;
using City_Hall_Management_Project.Models;
using Microsoft.EntityFrameworkCore;

namespace City_Hall_Management_Project.Repositories;

public class DocumentRepository(CityHallDbContext dbContext) : IDocumentRepository
{
    public async Task<IEnumerable<Document>> GetByCitizenProfileAsync(Guid citizenProfileId, CancellationToken ct)
    {
        return await dbContext.Documents
            .Where(d => d.CitizenProfileId == citizenProfileId)
            .OrderByDescending(d => d.UploadedAt)
            .ToListAsync(ct);
    }

    public async Task<Document?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await dbContext.Documents
            .Include(d => d.CitizenProfile)
                .ThenInclude(cp => cp!.User)
            .Include(d => d.ReviewedByUser)
            .FirstOrDefaultAsync(d => d.Id == id, ct);
    }

    public async Task<IEnumerable<Document>> GetPendingAsync(CancellationToken ct)
    {
        return await dbContext.Documents
            .Where(d => d.ApprovalStatus == "Pending")
            .Include(d => d.CitizenProfile)
                .ThenInclude(cp => cp!.User)
            .OrderBy(d => d.UploadedAt)
            .ToListAsync(ct);
    }

    public async Task AddAsync(Document document, CancellationToken ct)
    {
        await dbContext.Documents.AddAsync(document, ct);
    }

    public async Task SaveChangesAsync(CancellationToken ct)
    {
        await dbContext.SaveChangesAsync(ct);
    }

    public void Remove(Document document)
    {
        dbContext.Documents.Remove(document);
    }
}
