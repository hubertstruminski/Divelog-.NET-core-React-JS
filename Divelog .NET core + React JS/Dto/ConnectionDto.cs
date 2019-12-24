using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Dto
{
    public class ConnectionDto : Connection
    {
        public string tokenSecret { get; set; }
        public string screenName { get; set; }
    }
}
