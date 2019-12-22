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
    [Migration("20191222195203_createDivelogDatabase")]
    partial class createDivelogDatabase
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

                    b.Property<long?>("CustomTwitterId")
                        .HasColumnType("bigint");

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

                    b.Property<decimal>("TwitterUserId")
                        .HasColumnType("decimal(20,0)");

                    b.Property<decimal>("UserID")
                        .HasColumnType("decimal(20,0)");

                    b.HasKey("Id");

                    b.HasIndex("CustomTwitterId");

                    b.ToTable("Connections");
                });

            modelBuilder.Entity("Divelog_.NET_core___React_JS.Models.CustomTwitter", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("screenName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("tokenSecret")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("CustomTwitters");
                });

            modelBuilder.Entity("Divelog_.NET_core___React_JS.Models.Connection", b =>
                {
                    b.HasOne("Divelog_.NET_core___React_JS.Models.CustomTwitter", "CustomTwitter")
                        .WithMany()
                        .HasForeignKey("CustomTwitterId");
                });
#pragma warning restore 612, 618
        }
    }
}
