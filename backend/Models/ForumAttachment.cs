namespace City_Hall_Management_Project.Models;

public class ForumAttachment
{
    public Guid Id { get; set; }
    public Guid? ThreadId { get; set; }
    public Guid? PostId { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string StoredFileName { get; set; } = string.Empty;
    public string StoragePath { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public DateTime UploadedAt { get; set; }

    public ForumThread? Thread { get; set; }
    public ForumPost? Post { get; set; }
}
