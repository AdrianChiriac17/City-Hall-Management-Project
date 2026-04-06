namespace City_Hall_Management_Project.Models;

public class CitizenProfile
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;

    public User? User { get; set; }
    public ICollection<Request> Requests { get; set; } = new List<Request>();
}
