using Microsoft.EntityFrameworkCore.Migrations;

namespace Divelog_.NET_core___React_JS.Migrations
{
    public partial class addLogbookAndMarkerEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "tokenSecret",
                table: "CustomTwitters",
                newName: "TokenSecret");

            migrationBuilder.RenameColumn(
                name: "screenName",
                table: "CustomTwitters",
                newName: "ScreenName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TokenSecret",
                table: "CustomTwitters",
                newName: "tokenSecret");

            migrationBuilder.RenameColumn(
                name: "ScreenName",
                table: "CustomTwitters",
                newName: "screenName");
        }
    }
}
