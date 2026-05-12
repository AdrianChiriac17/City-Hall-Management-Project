namespace City_Hall_Management_Project.Models;

public class RequestDocument
{
    public Guid RequestId { get; set; }
    public Guid DocumentId { get; set; }

    public Request? Request { get; set; }
    public Document? Document { get; set; }
}
