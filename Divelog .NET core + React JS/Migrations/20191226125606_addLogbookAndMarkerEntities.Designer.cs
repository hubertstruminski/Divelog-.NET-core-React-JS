﻿// <auto-generated />
using System;
using Divelog_.NET_core___React_JS.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Divelog_.NET_core___React_JS.Migrations
{
    [DbContext(typeof(DivelogContext))]
    [Migration("20191226125606_addLogbookAndMarkerEntities")]
    partial class addLogbookAndMarkerEntities
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Divelog_.NET_core___React_JS.Models.Connection", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AccessToken")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsAuthenticated")
                        .HasColumnType("bit");

                    b.Property<DateTime>("LoggedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PictureUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProviderId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<long>("TwitterUserId")
                        .HasColumnType("bigint");

                    b.Property<long>("UserID")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.ToTable("Connections");
                });

            modelBuilder.Entity("Divelog_.NET_core___React_JS.Models.CustomTwitter", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ScreenName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TokenSecret")
                        .HasColumnType("nvarchar(max)");

                    b.Property<long>("UserId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("CustomTwitters");
                });

            modelBuilder.Entity("Divelog_.NET_core___React_JS.Models.CustomTwitter", b =>
                {
                    b.HasOne("Divelog_.NET_core___React_JS.Models.Connection", "User")
                        .WithOne("CustomTwitter")
                        .HasForeignKey("Divelog_.NET_core___React_JS.Models.CustomTwitter", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
