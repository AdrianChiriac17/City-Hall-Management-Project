namespace City_Hall_Management_Project.Models;

public class Document
{
    public int Id { get; set; }
    public int OwnerUserId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string StoragePath { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public User? OwnerUser { get; set; }
    public ICollection<RequestDocument> RequestLinks { get; set; } = new List<RequestDocument>();
}
