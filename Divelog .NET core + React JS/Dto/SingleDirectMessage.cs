using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Dto
{
    public class SingleDirectMessage
    {
        public long Id { get; set; }
        public string Text { get; set; }
        public long SenderId { get; set; }
        public long RecipientId { get; set; }
        public long TwitterOwnerId { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<Tweetinvi.Models.Entities.IUrlEntity> EntityUrls { get; set; }
    }
}
