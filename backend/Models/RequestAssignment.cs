namespace City_Hall_Management_Project.Models;

public class RequestAssignment
{
    public int RequestId { get; set; }
    public int EmployeeProfileId { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public string Notes { get; set; } = string.Empty;

    public Request? Request { get; set; }
    public EmployeeProfile? EmployeeProfile { get; set; }
}
