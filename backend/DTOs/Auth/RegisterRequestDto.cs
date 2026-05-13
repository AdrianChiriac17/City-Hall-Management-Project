using System.ComponentModel.DataAnnotations;

namespace City_Hall_Management_Project.DTOs.Auth;

public class RegisterRequestDto
{
    [Required, StringLength(80)]
    public string FirstName { get; set; } = string.Empty;

    [Required, StringLength(80)]
    public string LastName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string ConfirmPassword { get; set; } = string.Empty;

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
