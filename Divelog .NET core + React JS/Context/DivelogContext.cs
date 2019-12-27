using Divelog_.NET_core___React_JS.Enums;
using Divelog_.NET_core___React_JS.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Context
{
    public class DivelogContext : DbContext
    {
        public DivelogContext(DbContextOptions<DivelogContext> options) : base(options)
        {
            
        }

        public DbSet<Connection> Connections { get; set; }
        public DbSet<CustomTwitter> CustomTwitters { get; set; }
        public DbSet<Logbook> Logbooks { get; set; }
        public DbSet<Marker> Markers { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<CustomFile> Files { get; set; }
        public DbSet<TopicVote> TopicVotes { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=DESKTOP-UERIU9I\HUBERT;Database=Divelog;Trusted_Connection=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Connection>(entity =>
            {
                entity.HasOne(c => c.CustomTwitter)
                .WithOne(ct => ct.User)
                .HasForeignKey<CustomTwitter>(ct => ct.UserId);
            });

            modelBuilder.Entity<Logbook>(entity => { 
                entity.Property(l => l.DivingSuit)
                .HasConversion(v => v.ToString(), v => (DivingSuit)Enum.Parse(typeof(DivingSuit), v));

                entity.Property(l => l.DivingType)
                .HasConversion(v => v.ToString(), v => (DivingType)Enum.Parse(typeof(DivingType), v));

                entity.Property(l => l.GlovesType)
                .HasConversion(v => v.ToString(), v => (GloveType)Enum.Parse(typeof(GloveType), v));

                entity.Property(l => l.WaterEntryType)
                .HasConversion(v => v.ToString(), v => (WaterEntryType)Enum.Parse(typeof(WaterEntryType), v));

                entity.Property(l => l.WaterType)
                .HasConversion(v => v.ToString(), v => (WaterType)Enum.Parse(typeof(WaterType), v));
            });  
        }
    }
}
