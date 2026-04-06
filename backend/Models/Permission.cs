namespace City_Hall_Management_Project.Models;

public class Permission
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public int RoleId { get; set; }
    public Role? Role { get; set; }
}
