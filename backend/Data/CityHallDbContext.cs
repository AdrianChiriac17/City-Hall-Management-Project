using City_Hall_Management_Project.Models;
using Microsoft.EntityFrameworkCore;

namespace City_Hall_Management_Project.Data;

public class CityHallDbContext(DbContextOptions<CityHallDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<CitizenProfile> CitizenProfiles => Set<CitizenProfile>();
    public DbSet<EmployeeProfile> EmployeeProfiles => Set<EmployeeProfile>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Request> Requests => Set<Request>();
    public DbSet<RequestHistory> RequestHistory => Set<RequestHistory>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<RequestDocument> RequestDocuments => Set<RequestDocument>();
    public DbSet<RequestAssignment> RequestAssignments => Set<RequestAssignment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RequestDocument>()
            .HasKey(rd => new { rd.RequestId, rd.DocumentId });

        modelBuilder.Entity<RequestAssignment>()
            .HasKey(ra => new { ra.RequestId, ra.EmployeeProfileId });

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<CitizenProfile>()
            .HasOne(c => c.User)
            .WithOne(u => u.CitizenProfile)
            .HasForeignKey<CitizenProfile>(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<EmployeeProfile>()
            .HasOne(e => e.User)
            .WithOne(u => u.EmployeeProfile)
            .HasForeignKey<EmployeeProfile>(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Department>()
            .HasOne(d => d.HeadEmployee)
            .WithMany()
            .HasForeignKey(d => d.HeadEmployeeId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<RequestHistory>()
            .HasOne(h => h.ChangedByUser)
            .WithMany(u => u.RequestHistoryEntries)
            .HasForeignKey(h => h.ChangedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        base.OnModelCreating(modelBuilder);
    }
}
