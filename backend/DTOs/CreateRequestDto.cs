namespace City_Hall_Management_Project.DTOs;

public class CreateRequestDto
{
    public int CitizenProfileId { get; set; }
    public int? DepartmentId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
