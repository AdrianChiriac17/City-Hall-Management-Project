using Microsoft.AspNetCore.Identity;

namespace City_Hall_Management_Project.Models;

public class User : IdentityUser<Guid>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public CitizenProfile? CitizenProfile { get; set; }
    public EmployeeProfile? EmployeeProfile { get; set; }

    public ICollection<RequestHistory> RequestHistoryEntries { get; set; } = new List<RequestHistory>();
    public ICollection<ForumThread> ForumThreads { get; set; } = new List<ForumThread>();
    public ICollection<ForumPost> ForumPosts { get; set; } = new List<ForumPost>();
}
