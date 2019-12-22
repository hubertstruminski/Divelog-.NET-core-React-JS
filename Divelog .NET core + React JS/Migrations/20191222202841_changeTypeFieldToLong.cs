using Microsoft.EntityFrameworkCore.Migrations;

namespace Divelog_.NET_core___React_JS.Migrations
{
    public partial class changeTypeFieldToLong : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "UserID",
                table: "Connections",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(20,0)");

            migrationBuilder.AlterColumn<long>(
                name: "TwitterUserId",
                table: "Connections",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(20,0)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "UserID",
                table: "Connections",
                type: "decimal(20,0)",
                nullable: false,
                oldClrType: typeof(long));

            migrationBuilder.AlterColumn<decimal>(
                name: "TwitterUserId",
                table: "Connections",
                type: "decimal(20,0)",
                nullable: false,
                oldClrType: typeof(long));
        }
    }
}
