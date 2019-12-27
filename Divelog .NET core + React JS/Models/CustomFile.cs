using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Models
{
    public class CustomFile
    {
        public long Id { get; set; }
        public string ObjectId { get; set; }
        public string Url { get; set; }
        public long Size { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public Topic Topic { get; set; }
        public Post Post { get; set; }
    }
}
