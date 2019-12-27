using Divelog_.NET_core___React_JS.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Models
{
    public class Topic
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public int Likes { get; set; }
        public int Displays { get; set; }
        public DateTime CreatedAt { get; set; }
        public Connection User { get; set; }
        public ForumType LanguageForum { get; set; }
        public List<Post> Posts { get; set; }
        public List<CustomFile> Files { get; set; }
        public List<TopicVote> TopicVotes { get; set; }

    }
}
