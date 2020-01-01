using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Repositories
{
    public interface ITopicRepository
    {
        Topic GetById(long id);
        Topic GetByIdAndUser(long id, Connection user);
        List<Topic> FindAllAndOrderByCreatedAtAsc();
        List<Topic> FindAllAndOrderByLikeDesc();
        void Save(Topic topic);
        void Update(Topic topic);
        void Delete(Topic topic);
    }
}
