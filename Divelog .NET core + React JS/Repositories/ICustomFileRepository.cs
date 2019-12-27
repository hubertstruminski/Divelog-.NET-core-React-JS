using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Repositories
{
    public interface ICustomFileRepository
    {
        List<CustomFile> GetAllByTopic(Topic topic);
        List<CustomFile> GetAllByPost(Post post);
    }
}
