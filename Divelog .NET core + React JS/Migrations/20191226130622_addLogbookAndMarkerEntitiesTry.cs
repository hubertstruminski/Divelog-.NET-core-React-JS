using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Divelog_.NET_core___React_JS.Migrations
{
    public partial class addLogbookAndMarkerEntitiesTry : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Markers",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true),
                    Latitude = table.Column<double>(nullable: false),
                    Longitude = table.Column<double>(nullable: false),
                    UserId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Markers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Markers_Connections_UserId",
                        column: x => x.UserId,
                        principalTable: "Connections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Logbooks",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PartnerName = table.Column<string>(nullable: true),
                    PartnerSurname = table.Column<string>(nullable: true),
                    MarkerId = table.Column<long>(nullable: true),
                    EntryTime = table.Column<DateTime>(nullable: false),
                    ExitTime = table.Column<DateTime>(nullable: false),
                    AverageDepth = table.Column<double>(nullable: false),
                    MaxDepth = table.Column<double>(nullable: false),
                    Visibility = table.Column<double>(nullable: false),
                    WaterTemperature = table.Column<double>(nullable: false),
                    AirTemperature = table.Column<double>(nullable: false),
                    CylinderCapacity = table.Column<string>(nullable: true),
                    DivingSuit = table.Column<int>(nullable: false),
                    WaterType = table.Column<int>(nullable: false),
                    WaterEntryType = table.Column<int>(nullable: false),
                    Ballast = table.Column<double>(nullable: false),
                    GlovesType = table.Column<int>(nullable: false),
                    DivingType = table.Column<int>(nullable: false),
                    Comment = table.Column<string>(nullable: true),
                    UserId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Logbooks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Logbooks_Markers_MarkerId",
                        column: x => x.MarkerId,
                        principalTable: "Markers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Logbooks_Connections_UserId",
                        column: x => x.UserId,
                        principalTable: "Connections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Logbooks_MarkerId",
                table: "Logbooks",
                column: "MarkerId");

            migrationBuilder.CreateIndex(
                name: "IX_Logbooks_UserId",
                table: "Logbooks",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Markers_UserId",
                table: "Markers",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Logbooks");

            migrationBuilder.DropTable(
                name: "Markers");
        }
    }
}
