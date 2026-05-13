namespace City_Hall_Management_Project.Models;

public class ForumThread
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid AuthorUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsClosed { get; set; }

    public User? Author { get; set; }
    public ICollection<ForumPost> Posts { get; set; } = new List<ForumPost>();
    public ICollection<ForumAttachment> Attachments { get; set; } = new List<ForumAttachment>();
}
