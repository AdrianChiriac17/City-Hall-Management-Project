using City_Hall_Management_Project.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace City_Hall_Management_Project.Data;

public static class SeedData
{
    public static async Task InitializeAsync(
        CityHallDbContext dbContext,
        RoleManager<Role> roleManager,
        UserManager<User> userManager)
    {
        await SeedRoleAsync(roleManager, "Citizen", "Public user");
        await SeedRoleAsync(roleManager, "Clerk", "City hall employee");

        if (await dbContext.Users.AnyAsync())
        {
            return;
        }

        var citizenUser = new User
        {
            UserName = "john.doe@demo.local",
            Email = "john.doe@demo.local",
            FirstName = "John",
            LastName = "Doe",
            EmailConfirmed = true
        };

        var employeeUser = new User
        {
            UserName = "jane.smith@demo.local",
            Email = "jane.smith@demo.local",
            FirstName = "Jane",
            LastName = "Smith",
            EmailConfirmed = true
        };

        await CreateUserAsync(userManager, citizenUser, "Password123", "Citizen");
        await CreateUserAsync(userManager, employeeUser, "Password123", "Clerk");

        var citizenProfile = new CitizenProfile
        {
            User = citizenUser,
            PhoneNumber = "+1-555-0100",
            Address = "101 Main Street"
        };

        var department = new Department
        {
            Name = "Public Works",
            Description = "Handles roads, sanitation, and infrastructure"
        };

        var employeeProfile = new EmployeeProfile
        {
            User = employeeUser,
            Department = department,
            EmployeeNumber = "EMP-0001",
            JobTitle = "Service Clerk",
            IsDepartmentHead = true
        };

        department.HeadEmployee = employeeProfile;

        var request = new Request
        {
            CitizenProfile = citizenProfile,
            Department = department,
            Title = "Streetlight not working",
            Description = "Streetlight at 5th Avenue has been off for 3 days.",
            Status = "Submitted"
        };

        dbContext.AddRange(citizenProfile, employeeProfile, department, request);

        await dbContext.SaveChangesAsync();
    }

    private static async Task SeedRoleAsync(RoleManager<Role> roleManager, string name, string description)
    {
        if (await roleManager.RoleExistsAsync(name))
        {
            return;
        }

        var result = await roleManager.CreateAsync(new Role
        {
            Name = name,
            Description = description
        });

        if (!result.Succeeded)
        {
            throw new InvalidOperationException($"Failed to seed role '{name}': {FormatErrors(result)}");
        }
    }

    private static async Task CreateUserAsync(
        UserManager<User> userManager,
        User user,
        string password,
        string roleName)
    {
        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            throw new InvalidOperationException($"Failed to seed user '{user.Email}': {FormatErrors(result)}");
        }

        result = await userManager.AddToRoleAsync(user, roleName);
        if (!result.Succeeded)
        {
            throw new InvalidOperationException($"Failed to assign role '{roleName}' to '{user.Email}': {FormatErrors(result)}");
        }
    }

    private static string FormatErrors(IdentityResult result)
    {
        return string.Join(", ", result.Errors.Select(error => error.Description));
    }
}
