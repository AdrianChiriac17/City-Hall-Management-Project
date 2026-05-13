namespace City_Hall_Management_Project.DTOs.Forum;

public class ForumPostDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public Guid AuthorId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<ForumAttachmentDto> Attachments { get; set; } = [];
}
