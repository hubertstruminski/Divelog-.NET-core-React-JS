using Divelog_.NET_core___React_JS.Context;
using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Divelog_.NET_core___React_JS.Repositories
{
    public class CustomFileRepository : ICustomFileRepository
    {
        private DivelogContext _context;

        public CustomFileRepository(DivelogContext context)
        {
            _context = context;
        }

        public List<CustomFile> GetAllByTopic(Topic topic)
        {
            return _context.Files
                .Where(f => f.Topic == topic)
                .Include(f => f.Topic)
                .Include(f => f.Post)
                .ToList();
        }

        public List<CustomFile> GetAllByPost(Post post)
        {
            return _context.Files
                .Where(f => f.Post == post)
                .Include(f => f.Post)
                .Include(f => f.Topic)
                .ToList();
        }

        public void Save(CustomFile file)
        {
            _context.Files.Add(file);
            _context.SaveChanges();
        }
        
        public void Update(CustomFile file)
        {
            _context.Files.Update(file);
            _context.SaveChanges();
        }
        
        public void Delete(CustomFile file)
        {
            _context.Files.Remove(file);
            _context.SaveChanges();
        }
    }
}
