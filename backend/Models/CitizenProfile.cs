namespace City_Hall_Management_Project.Models;

public class CitizenProfile
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string PhoneCountryCode { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;

    public User? User { get; set; }
    public ICollection<Request> Requests { get; set; } = new List<Request>();
    public ICollection<Document> Documents { get; set; } = new List<Document>();
}
