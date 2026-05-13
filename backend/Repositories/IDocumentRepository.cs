using City_Hall_Management_Project.Models;

namespace City_Hall_Management_Project.Repositories;

public interface IDocumentRepository
{
    Task<IEnumerable<Document>> GetByCitizenProfileAsync(Guid citizenProfileId, CancellationToken ct);
    Task<Document?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<IEnumerable<Document>> GetPendingAsync(CancellationToken ct);
    Task AddAsync(Document document, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
    void Remove(Document document);
}
