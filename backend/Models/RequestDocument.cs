namespace City_Hall_Management_Project.Models;

public class RequestDocument
{
    public int RequestId { get; set; }
    public int DocumentId { get; set; }

    public Request? Request { get; set; }
    public Document? Document { get; set; }
}
