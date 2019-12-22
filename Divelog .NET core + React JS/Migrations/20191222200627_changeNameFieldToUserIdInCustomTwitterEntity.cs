using Microsoft.EntityFrameworkCore.Migrations;

namespace Divelog_.NET_core___React_JS.Migrations
{
    public partial class changeNameFieldToUserIdInCustomTwitterEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomTwitters_Connections_UserRef",
                table: "CustomTwitters");

            migrationBuilder.DropIndex(
                name: "IX_CustomTwitters_UserRef",
                table: "CustomTwitters");

            migrationBuilder.DropColumn(
                name: "UserRef",
                table: "CustomTwitters");

            migrationBuilder.AddColumn<long>(
                name: "UserId",
                table: "CustomTwitters",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_CustomTwitters_UserId",
                table: "CustomTwitters",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CustomTwitters_Connections_UserId",
                table: "CustomTwitters",
                column: "UserId",
                principalTable: "Connections",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomTwitters_Connections_UserId",
                table: "CustomTwitters");

            migrationBuilder.DropIndex(
                name: "IX_CustomTwitters_UserId",
                table: "CustomTwitters");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "CustomTwitters");

            migrationBuilder.AddColumn<long>(
                name: "UserRef",
                table: "CustomTwitters",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_CustomTwitters_UserRef",
                table: "CustomTwitters",
                column: "UserRef",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CustomTwitters_Connections_UserRef",
                table: "CustomTwitters",
                column: "UserRef",
                principalTable: "Connections",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
