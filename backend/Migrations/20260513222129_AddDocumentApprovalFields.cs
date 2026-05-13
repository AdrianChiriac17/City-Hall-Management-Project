using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace City_Hall_Management_Project.Migrations
{
    /// <inheritdoc />
    public partial class AddDocumentApprovalFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Documents_AspNetUsers_OwnerUserId",
                table: "Documents");

            migrationBuilder.RenameColumn(
                name: "OwnerUserId",
                table: "Documents",
                newName: "CitizenProfileId");

            migrationBuilder.RenameColumn(
                name: "FileName",
                table: "Documents",
                newName: "Title");

            migrationBuilder.RenameIndex(
                name: "IX_Documents_OwnerUserId",
                table: "Documents",
                newName: "IX_Documents_CitizenProfileId");

            migrationBuilder.AddColumn<string>(
                name: "ApprovalStatus",
                table: "Documents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Documents",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OriginalFileName",
                table: "Documents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RejectionReason",
                table: "Documents",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReviewedAt",
                table: "Documents",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ReviewedByUserId",
                table: "Documents",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Documents_ReviewedByUserId",
                table: "Documents",
                column: "ReviewedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_AspNetUsers_ReviewedByUserId",
                table: "Documents",
                column: "ReviewedByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_CitizenProfiles_CitizenProfileId",
                table: "Documents",
                column: "CitizenProfileId",
                principalTable: "CitizenProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Documents_AspNetUsers_ReviewedByUserId",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_Documents_CitizenProfiles_CitizenProfileId",
                table: "Documents");

            migrationBuilder.DropIndex(
                name: "IX_Documents_ReviewedByUserId",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "ApprovalStatus",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "OriginalFileName",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "RejectionReason",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "ReviewedAt",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "ReviewedByUserId",
                table: "Documents");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Documents",
                newName: "FileName");

            migrationBuilder.RenameColumn(
                name: "CitizenProfileId",
                table: "Documents",
                newName: "OwnerUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Documents_CitizenProfileId",
                table: "Documents",
                newName: "IX_Documents_OwnerUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_AspNetUsers_OwnerUserId",
                table: "Documents",
                column: "OwnerUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
