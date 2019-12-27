using Divelog_.NET_core___React_JS.Context;
using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Repositories
{
    public class MarkerRepository : IMarkerRepository
    {
        private DivelogContext _context;

        public MarkerRepository(DivelogContext context)
        {
            _context = context;
        }

        public void Save(Marker marker)
        {
            _context.Markers.Add(marker);
            _context.SaveChanges();
        }

        public void Delete(Marker marker)
        {
            _context.Markers.Remove(marker);
            _context.SaveChanges();
        }

        public void Update(Marker marker)
        {
            _context.Markers.Update(marker);
            _context.SaveChanges();
        }

        public List<Marker> FindAllByUser(Connection user)
        {
            return _context.Markers.Where(m => m.User == user).ToList();
        }

        public Marker FindByIdAndUser(long markerId, Connection user)
        {
            return _context.Markers.Where(m => m.Id == markerId && m.User == user).SingleOrDefault();
        }

        public void DeleteByIdAndUser(long markerId, Connection user)
        {
            Marker marker = _context.Markers.Where(m => m.Id == markerId && m.User == user).SingleOrDefault();
            _context.Markers.Remove(marker);
            _context.SaveChanges();
        }
    }
}
