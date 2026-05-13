namespace City_Hall_Management_Project.DTOs.Forum;

public class ForumThreadListItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int ReplyCount { get; set; }
    public bool IsClosed { get; set; }
}
