namespace City_Hall_Management_Project.Models;

public class EmployeeInDepartment
{
    public Guid EmployeeProfileId { get; set; }
    public EmployeeProfile? EmployeeProfile { get; set; }

    public Guid DepartmentId { get; set; }
    public Department? Department { get; set; }

    public bool IsDepartmentHead { get; set; }

    public Guid? ReportsToEmployeeId { get; set; }
    public EmployeeProfile? ReportsToEmployee { get; set; }
}