namespace City_Hall_Management_Project.Models;

public class Document
{
    public Guid Id { get; set; }
    public Guid CitizenProfileId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string StoragePath { get; set; } = string.Empty;
    public string ApprovalStatus { get; set; } = "Pending";
    public Guid? ReviewedByUserId { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public CitizenProfile? CitizenProfile { get; set; }
    public User? ReviewedByUser { get; set; }
    public ICollection<RequestDocument> RequestLinks { get; set; } = new List<RequestDocument>();
}
