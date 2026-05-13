using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace City_Hall_Management_Project.Migrations
{
    /// <inheritdoc />
    public partial class RefactorCitizenProfileAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Address",
                table: "CitizenProfiles",
                newName: "Street");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "CitizenProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "CitizenProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneCountryCode",
                table: "CitizenProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "CitizenProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "CitizenProfiles");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "CitizenProfiles");

            migrationBuilder.DropColumn(
                name: "PhoneCountryCode",
                table: "CitizenProfiles");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "CitizenProfiles");

            migrationBuilder.RenameColumn(
                name: "Street",
                table: "CitizenProfiles",
                newName: "Address");
        }
    }
}
