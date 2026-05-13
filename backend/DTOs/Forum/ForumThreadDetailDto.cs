namespace City_Hall_Management_Project.DTOs.Forum;

public class ForumThreadDetailDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public Guid AuthorId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsClosed { get; set; }
    public List<ForumAttachmentDto> Attachments { get; set; } = [];
    public List<ForumPostDto> Posts { get; set; } = [];
}
