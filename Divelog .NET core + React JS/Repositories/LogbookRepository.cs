using Divelog_.NET_core___React_JS.Context;
using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Divelog_.NET_core___React_JS.Repositories
{
    public class LogbookRepository : ILogbookRepository
    {
        private DivelogContext _context;

        public LogbookRepository(DivelogContext context)
        {
            _context = context;
        }

        public void Save(Logbook logbook)
        {
            _context.Logbooks.Add(logbook);
            _context.SaveChanges();
        }

        public void Update(Logbook logbook)
        {
            _context.Logbooks.Update(logbook);
            _context.SaveChanges();
        }

        public void Delete(Logbook logbook)
        {
            _context.Logbooks.Remove(logbook);
            _context.SaveChanges();
        }

        public Logbook FindByMarker(Marker marker)
        {
            return _context.Logbooks.Where(l => l.Marker == marker).SingleOrDefault();
        }

        public List<Logbook> FindAllByUser(Connection user)
        {
            return _context.Logbooks.Where(l => l.User == user).Include(logbook => logbook.Marker).ToList();
        }

        public Logbook FindByIdAndUser(long logbookId, Connection user)
        {
            return _context.Logbooks.Where(log => log.Id == logbookId && log.User == user).Include(logbook => logbook.Marker).SingleOrDefault();
        }
    }
}
