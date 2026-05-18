using City_Hall_Management_Project.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace City_Hall_Management_Project.Data;

public class CityHallDbContext(DbContextOptions<CityHallDbContext> options) : IdentityDbContext<User, Role, Guid>(options)
{
    public new DbSet<User> Users => Set<User>();
    public new DbSet<Role> Roles => Set<Role>();
    public DbSet<CitizenProfile> CitizenProfiles => Set<CitizenProfile>();
    public DbSet<EmployeeProfile> EmployeeProfiles => Set<EmployeeProfile>();
    public DbSet<EmployeeInDepartment> EmployeeInDepartments => Set<EmployeeInDepartment>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Request> Requests => Set<Request>();
    public DbSet<RequestHistory> RequestHistory => Set<RequestHistory>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<RequestDocument> RequestDocuments => Set<RequestDocument>();
    public DbSet<RequestAssignment> RequestAssignments => Set<RequestAssignment>();
    public DbSet<ForumThread> ForumThreads => Set<ForumThread>();
    public DbSet<ForumPost> ForumPosts => Set<ForumPost>();
    public DbSet<ForumAttachment> ForumAttachments => Set<ForumAttachment>();
    public DbSet<Announcement> Announcements => Set<Announcement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Document>()
            .HasOne(d => d.CitizenProfile)
            .WithMany(c => c.Documents)
            .HasForeignKey(d => d.CitizenProfileId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Document>()
            .HasOne(d => d.ReviewedByUser)
            .WithMany()
            .HasForeignKey(d => d.ReviewedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RequestDocument>()
            .HasKey(rd => new { rd.RequestId, rd.DocumentId });

        modelBuilder.Entity<RequestDocument>()
            .HasOne(rd => rd.Document)
            .WithMany(d => d.RequestLinks)
            .HasForeignKey(rd => rd.DocumentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RequestAssignment>()
            .HasKey(ra => new { ra.RequestId, ra.EmployeeProfileId });

        modelBuilder.Entity<RequestAssignment>()
            .HasOne(ra => ra.EmployeeProfile)
            .WithMany(e => e.AssignedRequests)
            .HasForeignKey(ra => ra.EmployeeProfileId)
            .OnDelete(DeleteBehavior.Restrict);

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

        modelBuilder.Entity<EmployeeInDepartment>()
            .HasKey(ed => new { ed.EmployeeProfileId, ed.DepartmentId });

        modelBuilder.Entity<EmployeeInDepartment>()
            .HasOne(ed => ed.EmployeeProfile)
            .WithMany(e => e.DepartmentRoles)
            .HasForeignKey(ed => ed.EmployeeProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<EmployeeInDepartment>()
            .HasOne(ed => ed.Department)
            .WithMany(d => d.Employees)
            .HasForeignKey(ed => ed.DepartmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<EmployeeInDepartment>()
            .HasOne(ed => ed.ReportsToEmployee)
            .WithMany()
            .HasForeignKey(ed => ed.ReportsToEmployeeId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RequestHistory>()
            .HasOne(h => h.ChangedByUser)
            .WithMany(u => u.RequestHistoryEntries)
            .HasForeignKey(h => h.ChangedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Forum
        modelBuilder.Entity<ForumThread>()
            .HasOne(t => t.Author)
            .WithMany(u => u.ForumThreads)
            .HasForeignKey(t => t.AuthorUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ForumPost>()
            .HasOne(p => p.Thread)
            .WithMany(t => t.Posts)
            .HasForeignKey(p => p.ThreadId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ForumPost>()
            .HasOne(p => p.Author)
            .WithMany(u => u.ForumPosts)
            .HasForeignKey(p => p.AuthorUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ForumAttachment>()
            .HasOne(a => a.Thread)
            .WithMany(t => t.Attachments)
            .HasForeignKey(a => a.ThreadId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ForumAttachment>()
            .HasOne(a => a.Post)
            .WithMany(p => p.Attachments)
            .HasForeignKey(a => a.PostId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Announcement>()
            .HasOne(a => a.Author)
            .WithMany(u => u.Announcements)
            .HasForeignKey(a => a.AuthorUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
