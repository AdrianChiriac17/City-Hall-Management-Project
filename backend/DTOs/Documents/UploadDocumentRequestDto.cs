using System.ComponentModel.DataAnnotations;

namespace City_Hall_Management_Project.DTOs.Documents;

public class UploadDocumentRequestDto
{
    [Required, StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Description { get; set; }

    [Required]
    public IFormFile File { get; set; } = null!;
}
