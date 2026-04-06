using City_Hall_Management_Project.Models;
using Microsoft.EntityFrameworkCore;

namespace City_Hall_Management_Project.Data;

public static class SeedData
{
    public static async Task InitializeAsync(CityHallDbContext dbContext)
    {
        if (await dbContext.Users.AnyAsync())
        {
            return;
        }

        var citizenRole = new Role { Name = "Citizen", Description = "Public user" };
        var clerkRole = new Role { Name = "Clerk", Description = "City hall employee" };

        dbContext.Roles.AddRange(citizenRole, clerkRole);

        var citizenUser = new User
        {
            Username = "john.doe",
            PasswordHash = "demo-hash",
            Email = "john.doe@demo.local",
            FirstName = "John",
            LastName = "Doe",
            Role = citizenRole
        };

        var employeeUser = new User
        {
            Username = "jane.smith",
            PasswordHash = "demo-hash",
            Email = "jane.smith@demo.local",
            FirstName = "Jane",
            LastName = "Smith",
            Role = clerkRole
        };

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
}
