using City_Hall_Management_Project.DTOs.Admin;
using City_Hall_Management_Project.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace City_Hall_Management_Project.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "System Administrator")]
public class AdminController(
    UserManager<User> userManager,
    RoleManager<Role> roleManager) : ControllerBase
{
    // ── GET /api/admin/users ───────────────────────────────────────────────
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await userManager.Users
            .OrderBy(u => u.LastName).ThenBy(u => u.FirstName)
            .ToListAsync();

        var result = new List<UserListItemDto>();
        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            result.Add(new UserListItemDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email ?? string.Empty,
                CreatedAt = user.CreatedAt,
                Roles = [.. roles]
            });
        }

        return Ok(result);
    }

    // ── GET /api/admin/roles ───────────────────────────────────────────────
    [HttpGet("roles")]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await roleManager.Roles
            .OrderBy(r => r.Name)
            .Select(r => r.Name!)
            .ToListAsync();

        return Ok(roles);
    }

    // ── PUT /api/admin/users/{id}/roles ───────────────────────────────────
    [HttpPut("users/{id:guid}/roles")]
    public async Task<IActionResult> UpdateUserRoles(Guid id, [FromBody] UpdateUserRolesDto dto)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        if (user is null) return NotFound(new { message = "User not found." });

        // Validate that all requested roles exist
        foreach (var role in dto.Roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                return BadRequest(new { message = $"Role '{role}' does not exist." });
        }

        var currentRoles = await userManager.GetRolesAsync(user);

        var removeResult = await userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!removeResult.Succeeded)
            return StatusCode(500, new { message = "Failed to remove existing roles." });

        if (dto.Roles.Count > 0)
        {
            var addResult = await userManager.AddToRolesAsync(user, dto.Roles);
            if (!addResult.Succeeded)
                return StatusCode(500, new { message = "Failed to assign new roles." });
        }

        var updatedRoles = await userManager.GetRolesAsync(user);
        return Ok(new UserListItemDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email ?? string.Empty,
            CreatedAt = user.CreatedAt,
            Roles = [.. updatedRoles]
        });
    }
}