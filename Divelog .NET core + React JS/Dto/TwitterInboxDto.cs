using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Dto
{
    public class TwitterInboxDto
    {
        public string RecipientId { get; set; }
        public string SenderId { get; set; }
        public string Name { get; set; }
        public string ScreenName { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Text { get; set; }
        public string PictureUrl { get; set; }
    }
}
