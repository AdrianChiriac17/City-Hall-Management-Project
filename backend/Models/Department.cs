namespace City_Hall_Management_Project.Models;

public class Department
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public int? HeadEmployeeId { get; set; }
    public EmployeeProfile? HeadEmployee { get; set; }

    public ICollection<EmployeeProfile> Employees { get; set; } = new List<EmployeeProfile>();
    public ICollection<Request> Requests { get; set; } = new List<Request>();
}
