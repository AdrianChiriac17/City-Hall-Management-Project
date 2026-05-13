using City_Hall_Management_Project.DTOs.Documents;

namespace City_Hall_Management_Project.Services;

public interface IDocumentService
{
    Task<IEnumerable<DocumentResponseDto>> GetMyDocumentsAsync(Guid citizenProfileId, CancellationToken ct);
    Task<DocumentResponseDto?> GetMyDocumentByIdAsync(Guid documentId, Guid citizenProfileId, CancellationToken ct);
    Task<DocumentResponseDto> UploadDocumentAsync(Guid citizenProfileId, UploadDocumentRequestDto dto, HttpRequest request, CancellationToken ct);
    Task<bool> DeleteDocumentAsync(Guid documentId, Guid citizenProfileId, CancellationToken ct);
    Task<IEnumerable<DocumentResponseDto>> GetPendingDocumentsAsync(CancellationToken ct);
    Task<DocumentResponseDto?> GetDocumentForReviewAsync(Guid documentId, CancellationToken ct);
    Task<DocumentResponseDto?> ReviewDocumentAsync(Guid documentId, Guid reviewerUserId, ReviewDocumentRequestDto dto, CancellationToken ct);
}
