using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Models
{
    public class CustomTwitter
    {
        public long Id { get; set; }
        public string TokenSecret { get; set; }
        public string ScreenName { get; set; }
        public long UserId { get; set; }
        public Connection User { get; set; }
    }
}
