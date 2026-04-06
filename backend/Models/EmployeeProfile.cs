namespace City_Hall_Management_Project.Models;

public class EmployeeProfile
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string EmployeeNumber { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public bool IsDepartmentHead { get; set; }

    public int DepartmentId { get; set; }
    public Department? Department { get; set; }
    public User? User { get; set; }

    public ICollection<RequestAssignment> AssignedRequests { get; set; } = new List<RequestAssignment>();
}
