using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Repositories
{
    public interface IPostRepository
    {
        List<Post> GetAllByTopicOrderByCreatedAtAsc(Topic topic);
        Post GetByIdAndUser(long id, Connection user);
        List<Post> GetAllByTopic(Topic topic);
    }
}
