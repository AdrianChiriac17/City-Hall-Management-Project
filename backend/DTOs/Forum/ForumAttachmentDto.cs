namespace City_Hall_Management_Project.DTOs.Forum;

public class ForumAttachmentDto
{
    public Guid Id { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
}
