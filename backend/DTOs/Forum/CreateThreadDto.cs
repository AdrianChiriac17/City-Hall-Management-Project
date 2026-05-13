using System.ComponentModel.DataAnnotations;

namespace City_Hall_Management_Project.DTOs.Forum;

public class CreateThreadDto
{
    [Required, StringLength(200, MinimumLength = 5)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(10000, MinimumLength = 10)]
    public string Content { get; set; } = string.Empty;
}
