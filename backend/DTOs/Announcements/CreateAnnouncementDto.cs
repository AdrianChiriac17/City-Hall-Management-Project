using System.ComponentModel.DataAnnotations;

namespace City_Hall_Management_Project.DTOs.Announcements;

public class CreateAnnouncementDto
{
    [Required, MinLength(5), MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required, MinLength(10), MaxLength(10000)]
    public string Content { get; set; } = string.Empty;

    public bool IsImportant { get; set; }
}
