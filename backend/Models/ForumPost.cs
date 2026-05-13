namespace City_Hall_Management_Project.Models;

public class ForumPost
{
    public Guid Id { get; set; }
    public Guid ThreadId { get; set; }
    public Guid AuthorUserId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ForumThread? Thread { get; set; }
    public User? Author { get; set; }
    public ICollection<ForumAttachment> Attachments { get; set; } = new List<ForumAttachment>();
}
