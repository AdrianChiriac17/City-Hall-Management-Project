namespace City_Hall_Management_Project.Models;

public class Request
{
    public int Id { get; set; }
    public int CitizenProfileId { get; set; }
    public int? DepartmentId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Submitted";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public CitizenProfile? CitizenProfile { get; set; }
    public Department? Department { get; set; }

    public ICollection<RequestHistory> History { get; set; } = new List<RequestHistory>();
    public ICollection<RequestDocument> Attachments { get; set; } = new List<RequestDocument>();
    public ICollection<RequestAssignment> Assignments { get; set; } = new List<RequestAssignment>();
}
