namespace City_Hall_Management_Project.DTOs.Auth;

public record AuthResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
