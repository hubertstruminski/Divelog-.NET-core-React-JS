using Divelog_.NET_core___React_JS.Context;
using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

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
            return _context.Posts
                .Where(post => post.Topic == topic)
                .OrderBy(post => post.CreatedAt)
                .Include(p => p.User)
                .Include(p => p.Topic)
                .ToList();
        }

        public Post GetByIdAndUser(long id, Connection user)
        {
            return _context.Posts
                .Where(post => post.Id == id && post.User == user)
                .Include(p => p.User)
                .Include(p => p.Topic)
                .SingleOrDefault();
        }

        public List<Post> GetAllByTopic(Topic topic)
        {
            return _context.Posts
                .Where(post => post.Topic == topic)
                .Include(p => p.User)
                .Include(p => p.Topic)
                .ToList();
        }

        public void Save(Post post)
        {
            _context.Posts.Add(post);
            _context.SaveChanges();
        }

        public void Update(Post post)
        {
            _context.Posts.Update(post);
            _context.SaveChanges();
        }
        
        public void Delete(Post post)
        {
            _context.Posts.Remove(post);
            _context.SaveChanges();
        }

        public void DeleteById(long postId)
        {
            Post post = _context.Posts
                .Where(p => p.Id == postId)
                .SingleOrDefault();

            _context.Posts.Remove(post);
            _context.SaveChanges();
        }
    }
}
