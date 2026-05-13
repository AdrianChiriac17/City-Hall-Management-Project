using System.ComponentModel.DataAnnotations;

namespace City_Hall_Management_Project.DTOs.Forum;

public class CreatePostDto
{
    [Required, StringLength(10000, MinimumLength = 1)]
    public string Content { get; set; } = string.Empty;
}
