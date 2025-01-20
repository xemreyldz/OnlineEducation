using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace educationPlatformApi.Migrations
{
    /// <inheritdoc />
    public partial class Rate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<double>(
                name: "AverageRating",
                table: "Courses",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AlterColumn<double>(
                name: "Rating",
                table: "CourseRatings",
                type: "float",
                nullable: false,
                defaultValue: 1.0,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 1);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseRatings_Users_UserID",
                table: "CourseRatings",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseRatings_Users_UserID",
                table: "CourseRatings");

            migrationBuilder.DropColumn(
                name: "AverageRating",
                table: "Courses");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "CourseRatings",
                newName: "StudentID");

            migrationBuilder.RenameIndex(
                name: "IX_CourseRatings_UserID",
                table: "CourseRatings",
                newName: "IX_CourseRatings_StudentID");

            migrationBuilder.AlterColumn<int>(
                name: "Rating",
                table: "CourseRatings",
                type: "int",
                nullable: false,
                defaultValue: 1,
                oldClrType: typeof(double),
                oldType: "float",
                oldDefaultValue: 1.0);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseRatings_Users_StudentID",
                table: "CourseRatings",
                column: "StudentID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
