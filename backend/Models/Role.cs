using Microsoft.AspNetCore.Identity;

namespace City_Hall_Management_Project.Models;

public class Role : IdentityRole<int>
{
    public string Description { get; set; } = string.Empty;

    public ICollection<Permission> Permissions { get; set; } = new List<Permission>();
}
