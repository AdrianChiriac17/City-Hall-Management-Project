namespace City_Hall_Management_Project.Models;

public class RequestHistory
{
    public Guid Id { get; set; }
    public Guid RequestId { get; set; }
    public Guid ChangedByUserId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    public Request? Request { get; set; }
    public User? ChangedByUser { get; set; }
}
