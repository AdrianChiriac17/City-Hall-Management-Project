using City_Hall_Management_Project.DTOs.Documents;
using City_Hall_Management_Project.Models;
using City_Hall_Management_Project.Repositories;

namespace City_Hall_Management_Project.Services;

public class DocumentService(
    IDocumentRepository repository,
    IWebHostEnvironment env,
    IHttpContextAccessor httpContextAccessor) : IDocumentService
{
    private const long MaxFileSizeBytes = 10 * 1024 * 1024;

    private static readonly Dictionary<string, string[]> AllowedTypes =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["application/pdf"]                                                         = [".pdf"],
            ["application/msword"]                                                      = [".doc"],
            ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"] = [".docx"],
            ["image/png"]                                                               = [".png"],
            ["image/jpeg"]                                                              = [".jpg", ".jpeg"]
        };

    public async Task<IEnumerable<DocumentResponseDto>> GetMyDocumentsAsync(
        Guid citizenProfileId, CancellationToken ct)
    {
        var docs = await repository.GetByCitizenProfileAsync(citizenProfileId, ct);
        return docs.Select(d => MapToDto(d));
    }

    public async Task<DocumentResponseDto?> GetMyDocumentByIdAsync(
        Guid documentId, Guid citizenProfileId, CancellationToken ct)
    {
        var doc = await repository.GetByIdAsync(documentId, ct);
        if (doc is null || doc.CitizenProfileId != citizenProfileId)
            return null;
        return MapToDto(doc);
    }

    public async Task<DocumentResponseDto> UploadDocumentAsync(
        Guid citizenProfileId, UploadDocumentRequestDto dto, HttpRequest request, CancellationToken ct)
    {
        var file = dto.File;

        if (file.Length > MaxFileSizeBytes)
            throw new InvalidOperationException("File size exceeds the 10 MB limit.");

        var mime = file.ContentType;
        if (!AllowedTypes.TryGetValue(mime, out var allowedExtensions))
            throw new InvalidOperationException($"File type '{mime}' is not allowed.");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(ext))
            throw new InvalidOperationException($"File extension '{ext}' does not match content type '{mime}'.");

        var storedName = $"{Guid.NewGuid()}{ext}";
        var relativePath = $"/uploads/documents/{storedName}";
        var absolutePath = Path.Combine(env.WebRootPath, "uploads", "documents", storedName);

        await using (var stream = File.Create(absolutePath))
        {
            await file.CopyToAsync(stream, ct);
        }

        var document = new Document
        {
            CitizenProfileId = citizenProfileId,
            Title = dto.Title,
            Description = dto.Description,
            OriginalFileName = file.FileName,
            FileType = mime,
            FileSizeBytes = file.Length,
            StoragePath = relativePath,
            ApprovalStatus = "Pending"
        };

        await repository.AddAsync(document, ct);
        await repository.SaveChangesAsync(ct);

        return new DocumentResponseDto(
            document.Id,
            document.Title,
            document.Description,
            document.OriginalFileName,
            document.ApprovalStatus,
            null,
            null,
            null,
            document.FileSizeBytes,
            BuildUrl(request, relativePath),
            document.UploadedAt,
            string.Empty
        );
    }

    public async Task<bool> DeleteDocumentAsync(
        Guid documentId, Guid citizenProfileId, CancellationToken ct)
    {
        var doc = await repository.GetByIdAsync(documentId, ct);
        if (doc is null || doc.CitizenProfileId != citizenProfileId)
            return false;

        if (doc.ApprovalStatus == "Approved")
            throw new InvalidOperationException("Approved documents cannot be deleted.");

        var absolutePath = Path.Combine(
            env.WebRootPath,
            doc.StoragePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

        if (File.Exists(absolutePath))
            File.Delete(absolutePath);

        repository.Remove(doc);
        await repository.SaveChangesAsync(ct);
        return true;
    }

    public async Task<IEnumerable<DocumentResponseDto>> GetPendingDocumentsAsync(CancellationToken ct)
    {
        var docs = await repository.GetPendingAsync(ct);
        return docs.Select(d => MapToDto(d, GetFullName(d.CitizenProfile?.User)));
    }

    public async Task<DocumentResponseDto?> GetDocumentForReviewAsync(Guid documentId, CancellationToken ct)
    {
        var doc = await repository.GetByIdAsync(documentId, ct);
        if (doc is null) return null;
        return MapToDto(doc, GetFullName(doc.CitizenProfile?.User));
    }

    public async Task<DocumentResponseDto?> ReviewDocumentAsync(
        Guid documentId, Guid reviewerUserId, ReviewDocumentRequestDto dto, CancellationToken ct)
    {
        var doc = await repository.GetByIdAsync(documentId, ct);
        if (doc is null) return null;

        if (!dto.IsApproved && string.IsNullOrWhiteSpace(dto.RejectionReason))
            throw new InvalidOperationException("A rejection reason is required when rejecting a document.");

        doc.ApprovalStatus = dto.IsApproved ? "Approved" : "Rejected";
        doc.ReviewedByUserId = reviewerUserId;
        doc.ReviewedAt = DateTime.UtcNow;
        doc.RejectionReason = dto.IsApproved ? null : dto.RejectionReason;

        await repository.SaveChangesAsync(ct);
        return MapToDto(doc, GetFullName(doc.CitizenProfile?.User));
    }

    private DocumentResponseDto MapToDto(Document d, string ownerName = "")
    {
        var request = httpContextAccessor.HttpContext?.Request;
        var url = request is not null ? BuildUrl(request, d.StoragePath) : d.StoragePath;
        var reviewedByName = d.ReviewedByUser is not null
            ? $"{d.ReviewedByUser.FirstName} {d.ReviewedByUser.LastName}".Trim()
            : null;

        return new DocumentResponseDto(
            d.Id,
            d.Title,
            d.Description,
            d.OriginalFileName,
            d.ApprovalStatus,
            d.RejectionReason,
            reviewedByName,
            d.ReviewedAt,
            d.FileSizeBytes,
            url,
            d.UploadedAt,
            ownerName
        );
    }

    private static string BuildUrl(HttpRequest request, string storagePath)
        => $"{request.Scheme}://{request.Host}{storagePath}";

    private static string GetFullName(User? user)
        => user is not null ? $"{user.FirstName} {user.LastName}".Trim() : string.Empty;
}
