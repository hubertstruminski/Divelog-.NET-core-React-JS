using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Dto
{
    public class TweetDto
    {
        public string Message { get; set; }
        public List<TweetFileDto> Files { get; set; }
    }
}
