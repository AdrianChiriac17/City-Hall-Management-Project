using System.ComponentModel.DataAnnotations;

namespace City_Hall_Management_Project.DTOs;

public class UpdateMyRequestDto
{
    [Required, StringLength(200, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(5000, MinimumLength = 10)]
    public string Description { get; set; } = string.Empty;
}
