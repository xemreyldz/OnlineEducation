using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace educationPlatformApi.Migrations
{
    /// <inheritdoc />
    public partial class RateV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseRatings_Users_UserID",
                table: "CourseRatings");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "CourseRatings",
                newName: "StudentID");

            migrationBuilder.RenameIndex(
                name: "IX_CourseRatings_UserID",
                table: "CourseRatings",
                newName: "IX_CourseRatings_StudentID");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseRatings_Users_StudentID",
                table: "CourseRatings",
                column: "StudentID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseRatings_Users_StudentID",
                table: "CourseRatings");

            migrationBuilder.RenameColumn(
                name: "StudentID",
                table: "CourseRatings",
                newName: "UserID");

            migrationBuilder.RenameIndex(
                name: "IX_CourseRatings_StudentID",
                table: "CourseRatings",
                newName: "IX_CourseRatings_UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseRatings_Users_UserID",
                table: "CourseRatings",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
