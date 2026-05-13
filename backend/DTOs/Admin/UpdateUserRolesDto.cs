using System.ComponentModel.DataAnnotations;

namespace City_Hall_Management_Project.DTOs.Admin;

public class UpdateUserRolesDto
{
    [Required]
    public List<string> Roles { get; set; } = [];
}