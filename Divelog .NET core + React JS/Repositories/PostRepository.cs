using Divelog_.NET_core___React_JS.Context;
using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Repositories
{
    public class PostRepository : IPostRepository
    {
        private DivelogContext _context;

        public PostRepository(DivelogContext context)
        {
            _context = context;
        }

        public List<Post> GetAllByTopicOrderByCreatedAtAsc(Topic topic)
        {
            return _context.Posts.Where(post => post.Topic == topic).OrderBy(post => post.CreatedAt).ToList();
        }

        public Post GetByIdAndUser(long id, Connection user)
        {
            return _context.Posts.Where(post => post.Id == id && post.User == user).SingleOrDefault();
        }

        public List<Post> GetAllByTopic(Topic topic)
        {
            return _context.Posts.Where(post => post.Topic == topic).ToList();
        }
    }
}
