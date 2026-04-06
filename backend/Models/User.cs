namespace City_Hall_Management_Project.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public int RoleId { get; set; }
    public Role? Role { get; set; }

    public CitizenProfile? CitizenProfile { get; set; }
    public EmployeeProfile? EmployeeProfile { get; set; }

    public ICollection<RequestHistory> RequestHistoryEntries { get; set; } = new List<RequestHistory>();
}
