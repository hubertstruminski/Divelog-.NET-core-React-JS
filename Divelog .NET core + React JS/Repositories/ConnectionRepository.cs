using Divelog_.NET_core___React_JS.Context;
using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Repositories
{
    public class ConnectionRepository : IConnectionRepository
    {
        private DivelogContext _context;

        public ConnectionRepository(DivelogContext context)
        {
            _context = context;
        }

        public Connection FindByTwitterUserIdOrEmail(long twitterUserId, string email)
        {
            return _context.Connections
                .Where(c => c.TwitterUserId == twitterUserId || c.Email == email)
                .SingleOrDefault();
        }

        public void Save(Connection connection)
        {
            _context.Connections.Add(connection);
            _context.SaveChanges();
        }

        public void Update(Connection connection)
        {
            _context.Connections.Update(connection);
            _context.SaveChanges();

        }

        public Connection findByUserIdOrTwitterUserId(long userId, long twitterUserId)
        {
            return _context.Connections.Where(c => c.UserID == userId || c.TwitterUserId == twitterUserId).Single();
        }
    }

}
