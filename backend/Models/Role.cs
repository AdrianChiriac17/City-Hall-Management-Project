using Microsoft.AspNetCore.Identity;

namespace City_Hall_Management_Project.Models;

public class Role : IdentityRole<Guid>
{
    public string Description { get; set; } = string.Empty;
}
