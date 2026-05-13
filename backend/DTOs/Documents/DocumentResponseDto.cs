namespace City_Hall_Management_Project.DTOs.Documents;

public record DocumentResponseDto(
    Guid Id,
    string Title,
    string? Description,
    string OriginalFileName,
    string ApprovalStatus,
    string? RejectionReason,
    string? ReviewedByName,
    DateTime? ReviewedAt,
    long FileSizeBytes,
    string Url,
    DateTime UploadedAt,
    string OwnerName
);
