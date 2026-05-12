namespace City_Hall_Management_Project.DTOs;

public class CreateRequestDto
{
    public Guid CitizenProfileId { get; set; }
    public Guid? DepartmentId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
