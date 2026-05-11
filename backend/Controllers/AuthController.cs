using City_Hall_Management_Project.DTOs.Auth;
using City_Hall_Management_Project.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace City_Hall_Management_Project.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    RoleManager<Role> roleManager) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterRequestDto dto)
    {
        if (dto.Password != dto.ConfirmPassword)
        {
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = "Password and confirm password do not match."
            });
        }

        var existingUser = await userManager.FindByEmailAsync(dto.Email);
        if (existingUser is not null)
        {
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = "An account with this email already exists."
            });
        }

        const string defaultRole = "Citizen";
        if (!await roleManager.RoleExistsAsync(defaultRole))
        {
            var roleResult = await roleManager.CreateAsync(new Role
            {
                Name = defaultRole,
                Description = "Public user"
            });

            if (!roleResult.Succeeded)
            {
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = FormatErrors(roleResult)
                });
            }
        }

        var user = new User
        {
            UserName = dto.Email,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createResult = await userManager.CreateAsync(user, dto.Password);
        if (!createResult.Succeeded)
        {
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = FormatErrors(createResult)
            });
        }

        var roleAssignResult = await userManager.AddToRoleAsync(user, defaultRole);
        if (!roleAssignResult.Succeeded)
        {
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = FormatErrors(roleAssignResult)
            });
        }

        return Ok(new AuthResponseDto
        {
            Success = true,
            Message = "Registration successful."
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginRequestDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);
        if (user is null)
        {
            return Unauthorized(new AuthResponseDto
            {
                Success = false,
                Message = "Invalid email or password."
            });
        }

        var result = await signInManager.PasswordSignInAsync(user, dto.Password, dto.RememberMe, lockoutOnFailure: true);
        if (!result.Succeeded)
        {
            return Unauthorized(new AuthResponseDto
            {
                Success = false,
                Message = "Invalid email or password."
            });
        }

        user.UpdatedAt = DateTime.UtcNow;
        await userManager.UpdateAsync(user);

        return Ok(new AuthResponseDto
        {
            Success = true,
            Message = "Login successful."
        });
    }

    [HttpPost("logout")]
    public async Task<ActionResult<AuthResponseDto>> Logout()
    {
        await signInManager.SignOutAsync();

        return Ok(new AuthResponseDto
        {
            Success = true,
            Message = "Logout successful."
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null)
        {
            return Unauthorized();
        }

        var roles = await userManager.GetRolesAsync(user);

        return Ok(new
        {
            user.Id,
            user.Email,
            user.UserName,
            user.FirstName,
            user.LastName,
            Roles = roles
        });
    }

    private static string FormatErrors(IdentityResult result)
    {
        return string.Join(", ", result.Errors.Select(error => error.Description));
    }
}
