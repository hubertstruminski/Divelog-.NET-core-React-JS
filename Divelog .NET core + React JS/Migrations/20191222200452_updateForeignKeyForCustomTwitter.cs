using Microsoft.EntityFrameworkCore.Migrations;

namespace Divelog_.NET_core___React_JS.Migrations
{
    public partial class updateForeignKeyForCustomTwitter : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connections_CustomTwitters_CustomTwitterId",
                table: "Connections");

            migrationBuilder.DropIndex(
                name: "IX_Connections_CustomTwitterId",
                table: "Connections");

            migrationBuilder.DropColumn(
                name: "CustomTwitterId",
                table: "Connections");

            migrationBuilder.AddColumn<long>(
                name: "UserRef",
                table: "CustomTwitters",
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

        protected override void Down(MigrationBuilder migrationBuilder)
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
                name: "CustomTwitterId",
                table: "Connections",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Connections_CustomTwitterId",
                table: "Connections",
                column: "CustomTwitterId");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_CustomTwitters_CustomTwitterId",
                table: "Connections",
                column: "CustomTwitterId",
                principalTable: "CustomTwitters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
