using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Models
{
    public class Marker
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public Connection User { get; set; }

        [JsonIgnore]
        public List<Logbook> Logbooks { get; set; }
    }
}
