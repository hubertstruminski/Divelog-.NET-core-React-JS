using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Divelog_.NET_core___React_JS.Migrations
{
    public partial class createDivelogDatabase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CustomTwitters",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tokenSecret = table.Column<string>(nullable: true),
                    screenName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomTwitters", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Connections",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<decimal>(nullable: false),
                    TwitterUserId = table.Column<decimal>(nullable: false),
                    Email = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    AccessToken = table.Column<string>(nullable: true),
                    IsAuthenticated = table.Column<bool>(nullable: false),
                    PictureUrl = table.Column<string>(nullable: true),
                    ProviderId = table.Column<string>(nullable: true),
                    LoggedAt = table.Column<DateTime>(nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    CustomTwitterId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Connections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Connections_CustomTwitters_CustomTwitterId",
                        column: x => x.CustomTwitterId,
                        principalTable: "CustomTwitters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Connections_CustomTwitterId",
                table: "Connections",
                column: "CustomTwitterId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Connections");

            migrationBuilder.DropTable(
                name: "CustomTwitters");
        }
    }
}
