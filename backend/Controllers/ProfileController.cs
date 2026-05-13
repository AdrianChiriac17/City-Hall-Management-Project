using City_Hall_Management_Project.Data;
using City_Hall_Management_Project.DTOs.Profile;
using City_Hall_Management_Project.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace City_Hall_Management_Project.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController(
    UserManager<User> userManager,
    CityHallDbContext dbContext) : ControllerBase
{
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var roles = await userManager.GetRolesAsync(user);

        var profile = await dbContext.CitizenProfiles
            .FirstOrDefaultAsync(p => p.UserId == user.Id);

        return Ok(new ProfileDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email ?? string.Empty,
            CreatedAt = user.CreatedAt,
            Roles = roles.ToList(),
            PhoneCountryCode = profile?.PhoneCountryCode ?? string.Empty,
            PhoneNumber = profile?.PhoneNumber ?? string.Empty,
            Street = profile?.Street ?? string.Empty,
            City = profile?.City ?? string.Empty,
            PostalCode = profile?.PostalCode ?? string.Empty,
            Country = profile?.Country ?? string.Empty
        });
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto dto)
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var profile = await dbContext.CitizenProfiles
            .FirstOrDefaultAsync(p => p.UserId == user.Id);

        if (profile is null)
        {
            return NotFound(new { message = "Contact profile not found for this account." });
        }

        profile.PhoneCountryCode = dto.PhoneCountryCode;
        profile.PhoneNumber = dto.PhoneNumber;
        profile.Street = dto.Street;
        profile.City = dto.City;
        profile.PostalCode = dto.PostalCode;
        profile.Country = dto.Country;

        user.UpdatedAt = DateTime.UtcNow;
        await userManager.UpdateAsync(user);
        await dbContext.SaveChangesAsync();

        return Ok(new { message = "Profile updated successfully." });
    }
}
