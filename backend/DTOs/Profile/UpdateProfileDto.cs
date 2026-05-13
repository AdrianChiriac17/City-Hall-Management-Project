using System.ComponentModel.DataAnnotations;

namespace City_Hall_Management_Project.DTOs.Profile;

public class UpdateProfileDto
{
    [Required, RegularExpression(@"^\+\d{1,4}$", ErrorMessage = "Invalid country dialling code.")]
    public string PhoneCountryCode { get; set; } = string.Empty;

    [Required, RegularExpression(@"^[\d\s\-\(\)]{4,20}$", ErrorMessage = "Phone number must contain 4–20 digits.")]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required, StringLength(200)]
    public string Street { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string City { get; set; } = string.Empty;

    [Required, StringLength(20)]
    public string PostalCode { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string Country { get; set; } = string.Empty;
}
