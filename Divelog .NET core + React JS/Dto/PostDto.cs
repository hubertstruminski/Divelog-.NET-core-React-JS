using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Dto
{
    public class PostDto
    {
        public string Message { get; set; }
        public long topicId { get; set; }
        public List<CustomFile> Files { get; set; }
        public bool isPostOwner { get; set; }
    }
}
