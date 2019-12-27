using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Repositories
{
    public interface ITopicVoteRepository
    {
        TopicVote GetByTopic(Topic topic);
        TopicVote GetByTopicAndUser(Topic topic, Connection user);
    }
}
