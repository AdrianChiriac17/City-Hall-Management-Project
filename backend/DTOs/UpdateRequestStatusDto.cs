namespace City_Hall_Management_Project.DTOs;

public class UpdateRequestStatusDto
{
    public string Status { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public int ChangedByUserId { get; set; }
}
