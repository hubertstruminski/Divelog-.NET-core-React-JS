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

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=DESKTOP-UERIU9I\HUBERT;Database=Divelog;Trusted_Connection=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Connection>(entity =>
            {
                //entity.Property(c => c.UserID)
                //.IsRequired(false);

                entity.HasOne(c => c.CustomTwitter)
                .WithOne(ct => ct.User)
                .HasForeignKey<CustomTwitter>(ct => ct.UserId);
            });         
        }
    }
}
