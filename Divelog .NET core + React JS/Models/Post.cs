using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Models
{
    public class Post
    {
        public long Id { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Connection User { get; set; }
        public Topic Topic { get; set; }
        public List<CustomFile> Files { get; set; }
    }
}
