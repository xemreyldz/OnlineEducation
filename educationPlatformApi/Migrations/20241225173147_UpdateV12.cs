using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace educationPlatformApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateV12 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CourseID",
                table: "Comments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Comments_CourseID",
                table: "Comments",
                column: "CourseID");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Courses_CourseID",
                table: "Comments",
                column: "CourseID",
                principalTable: "Courses",
                principalColumn: "CourseID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Courses_CourseID",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_CourseID",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "CourseID",
                table: "Comments");
        }
    }
}
