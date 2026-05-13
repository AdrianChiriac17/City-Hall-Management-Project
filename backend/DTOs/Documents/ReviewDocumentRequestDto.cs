using System.ComponentModel.DataAnnotations;

namespace City_Hall_Management_Project.DTOs.Documents;

public class ReviewDocumentRequestDto
{
    [Required]
    public bool IsApproved { get; set; }

    [StringLength(1000)]
    public string? RejectionReason { get; set; }
}
