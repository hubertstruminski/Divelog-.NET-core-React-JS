﻿using Divelog_.NET_core___React_JS.Context;
using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Divelog_.NET_core___React_JS.Repositories
{
    public class TopicRepository : ITopicRepository
    {
        private DivelogContext _context;

        public TopicRepository(DivelogContext context)
        {
            _context = context;
        }

        public Topic GetById(long id)
        {
            return _context.Topics.Where(topic => topic.Id == id).Include(topic => topic.User).SingleOrDefault();
        }

        public Topic GetByIdAndUser(long id, Connection user)
        {
            return _context.Topics.Where(topic => topic.Id == id && topic.User == user).Include(topic => topic.User).SingleOrDefault();
        }

        public List<Topic> FindAllAndOrderByCreatedAtAsc()
        {
            return _context.Topics.OrderBy(topic => topic.CreatedAt).Include(topic => topic.User).ToList();
        }

        public List<Topic> FindAllAndOrderByLikeDesc()
        {
            return _context.Topics.OrderByDescending(topic => topic.Likes).Include(topic => topic.User).ToList();
        }

        public void Save(Topic topic)
        {
            _context.Topics.Add(topic);
            _context.SaveChanges();
        }
        
        public void Update(Topic topic)
        {
            _context.Topics.Update(topic);
            _context.SaveChanges();
        }
       
        public void Delete(Topic topic)
        {
            _context.Topics.Remove(topic);
            _context.SaveChanges();
        }
    }
}
