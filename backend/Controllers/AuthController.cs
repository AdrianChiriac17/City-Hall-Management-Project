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
    ILogger<AuthController> logger) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterRequestDto dto)
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        logger.LogInformation("Registration request started");

        if (dto.Password != dto.ConfirmPassword)
        {
            logger.LogWarning("Registration failed for in {ElapsedMilliseconds}ms: Passwords do not match", stopwatch.ElapsedMilliseconds);
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = "Password and confirm password do not match."
            });
        }

        var existingUser = await userManager.FindByEmailAsync(dto.Email);
        logger.LogInformation("FindByEmailAsync completed in {ElapsedMilliseconds}ms", stopwatch.ElapsedMilliseconds);

        if (existingUser is not null)
        {
            logger.LogWarning("Registration failed in {ElapsedMilliseconds}ms: Account already exists",stopwatch.ElapsedMilliseconds);
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = "An account with this email already exists."
            });
        }

        const string defaultRole = "Citizen";

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
        logger.LogInformation("CreateAsync completed in {ElapsedMilliseconds}ms", stopwatch.ElapsedMilliseconds);
        if (!createResult.Succeeded)
        {
            logger.LogError("Registration failed in {ElapsedMilliseconds}ms: {Errors}", stopwatch.ElapsedMilliseconds, FormatErrors(createResult));
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = FormatErrors(createResult)
            });
        }

        var roleAssignResult = await userManager.AddToRoleAsync(user, defaultRole);
        if (!roleAssignResult.Succeeded)
        {
            logger.LogError("Role assignment failed in {ElapsedMilliseconds}ms: {Errors}", stopwatch.ElapsedMilliseconds, FormatErrors(roleAssignResult));
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = FormatErrors(roleAssignResult)
            });
        }

        logger.LogInformation("Registration successful in {ElapsedMilliseconds}ms", stopwatch.ElapsedMilliseconds);
        return Ok(new AuthResponseDto
        {
            Success = true,
            Message = "Registration successful."
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginRequestDto dto)
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        logger.LogInformation("Login request started");

        var user = await userManager.FindByEmailAsync(dto.Email);
        logger.LogInformation("FindByEmailAsync completed in {ElapsedMilliseconds}ms", stopwatch.ElapsedMilliseconds);

        if (user is null)
        {
            return Unauthorized(new AuthResponseDto
            {
                Success = false,
                Message = "Invalid email or password."
            });
        }

        var result = await signInManager.PasswordSignInAsync(user, dto.Password, isPersistent: false, lockoutOnFailure: true);
        logger.LogInformation("PasswordSignInAsync completed in {ElapsedMilliseconds}ms with result {Succeeded}", stopwatch.ElapsedMilliseconds, result.Succeeded);

        if (result.IsLockedOut)
        {
            return Unauthorized(new AuthResponseDto
            {
                Success = false,
                Message = "Account locked out due to 5 consecutive failed attempts. Please try again after 5 minutes."
            });
        }

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
        logger.LogInformation("Login processing finished globally in {ElapsedMilliseconds}ms", stopwatch.ElapsedMilliseconds);

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
