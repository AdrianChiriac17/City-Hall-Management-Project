namespace City_Hall_Management_Project.Models;

public class Department
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public ICollection<EmployeeInDepartment> Employees { get; set; } = new List<EmployeeInDepartment>();
    public ICollection<Request> Requests { get; set; } = new List<Request>();
}
