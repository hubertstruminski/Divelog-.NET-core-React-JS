using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Dto
{
    public class TopicTemplate
    {
        public int numberDisplay { get; set; }
        public int numberComments { get; set; }
        public int likes { get; set; }
        public int vote { get; set; }

        public TopicTemplate(int numberDisplay, int numberComments, int likes, int vote)
        {
            this.numberDisplay = numberDisplay;
            this.numberComments = numberComments;
            this.likes = likes;
            this.vote = vote;
        }
    }
}
