using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace educationPlatformApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateV19 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Users_StudentID",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "StudentID",
                table: "Notifications",
                newName: "InstructorID");

            migrationBuilder.RenameIndex(
                name: "IX_Notifications_StudentID",
                table: "Notifications",
                newName: "IX_Notifications_InstructorID");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Users_InstructorID",
                table: "Notifications",
                column: "InstructorID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Users_InstructorID",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "InstructorID",
                table: "Notifications",
                newName: "StudentID");

            migrationBuilder.RenameIndex(
                name: "IX_Notifications_InstructorID",
                table: "Notifications",
                newName: "IX_Notifications_StudentID");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Users_StudentID",
                table: "Notifications",
                column: "StudentID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
