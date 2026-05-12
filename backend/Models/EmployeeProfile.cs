namespace City_Hall_Management_Project.Models;

public class EmployeeProfile
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string EmployeeNumber { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;

    public User? User { get; set; }

    public ICollection<EmployeeInDepartment> DepartmentRoles { get; set; } = new List<EmployeeInDepartment>();
    public ICollection<RequestAssignment> AssignedRequests { get; set; } = new List<RequestAssignment>();
}
