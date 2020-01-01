using Divelog_.NET_core___React_JS.Context;
using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Divelog_.NET_core___React_JS.Repositories
{
    public class TopicVoteRepository : ITopicVoteRepository
    {
        private DivelogContext _context;

        public TopicVoteRepository(DivelogContext context)
        {
            _context = context;
        }

        public TopicVote GetByTopic(Topic topic)
        {
            return _context.TopicVotes
                .Where(topicVote => topicVote.Topic == topic)
                .Include(topicVote => topicVote.User)
                .SingleOrDefault();
        }

        public TopicVote GetByTopicAndUser(Topic topic, Connection user)
        {
            return _context.TopicVotes
                .Where(topicVote => topicVote.Topic == topic && topicVote.User == user)
                .Include(topicVote => topicVote.User)
                .Include(topicVote => topicVote.Topic)
                .SingleOrDefault();
        }

        public void Save(TopicVote topicVote)
        {
            _context.TopicVotes.Add(topicVote);
            _context.SaveChanges();
        }

        public void Update(TopicVote topicVote)
        {
            _context.TopicVotes.Update(topicVote);
            _context.SaveChanges();
        }

        public void Delete(TopicVote topicVote)
        {
            _context.TopicVotes.Remove(topicVote);
            _context.SaveChanges();
        }
    }
}
