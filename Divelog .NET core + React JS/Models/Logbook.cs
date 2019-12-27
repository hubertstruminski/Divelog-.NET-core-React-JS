using Divelog_.NET_core___React_JS.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Models
{
    public class Logbook
    {
        public long Id { get; set; }
        public string PartnerName { get; set; }
        public string PartnerSurname { get; set; }
        public Marker Marker { get; set; }
        public DateTime EntryTime { get; set; }
        public DateTime ExitTime { get; set; }
        public double AverageDepth { get; set; }
        public double MaxDepth { get; set; }
        public double Visibility { get; set; }
        public double WaterTemperature { get; set; }
        public double AirTemperature { get; set; }
        public string CylinderCapacity { get; set; }
        public DivingSuit DivingSuit { get; set; }
        public WaterType WaterType { get; set; }
        public WaterEntryType WaterEntryType { get; set; }
        public double Ballast { get; set; }
        public GloveType GlovesType { get; set; }
        public DivingType DivingType { get; set; }
        public string Comment { get; set; }
        public Connection User { get; set; }
    }
}
