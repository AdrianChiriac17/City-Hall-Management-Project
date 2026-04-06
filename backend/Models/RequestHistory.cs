namespace City_Hall_Management_Project.Models;

public class RequestHistory
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public int ChangedByUserId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    public Request? Request { get; set; }
    public User? ChangedByUser { get; set; }
}
