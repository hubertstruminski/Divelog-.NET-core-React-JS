using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Models
{
    public class CustomTwitter
    {
        public long Id { get; set; }
        public string tokenSecret { get; set; }
        public string screenName { get; set; }
        public long UserId { get; set; }
        public Connection User { get; set; }
    }
}
