using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Models
{
    public class TopicVote
    {
        public long Id { get; set; }
        public int Vote { get; set; }
        public Topic Topic { get; set; }
        public Connection User { get; set; }
    }
}
