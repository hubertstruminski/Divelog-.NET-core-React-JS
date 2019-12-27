using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Models
{
    public class Connection
    {
        public long Id { get; set; }
        public long UserID { get; set; }
        public long TwitterUserId { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string AccessToken { get; set; }
        public bool IsAuthenticated { get; set; }
        public string PictureUrl { get; set; }
        public string ProviderId { get; set; }
        public DateTime LoggedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public CustomTwitter CustomTwitter { get; set; }
        private List<Logbook> Logbooks { get; set; }
        private List<Marker> Markers { get; set; }
        private List<Topic> Topics { get; set; }
    }
}