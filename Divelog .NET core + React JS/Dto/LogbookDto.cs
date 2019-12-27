using Divelog_.NET_core___React_JS.Enums;
using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Dto
{
    public class LogbookDto
    {
        public string PartnerName { get; set; }
        public string PartnerSurname { get; set; }
        public Marker Marker { get; set; }
        public DateTime EntryTime { get; set; }
        public DateTime ExitTime { get; set; }
        public string AverageDepth { get; set; }
        public string MaxDepth { get; set; }
        public string Visibility { get; set; }
        public string WaterTemperature { get; set; }
        public string AirTemperature { get; set; }
        public string CylinderCapacity { get; set; }
        public string DivingSuit { get; set; }
        public string WaterType { get; set; }
        public string WaterEntryType { get; set; }
        public string Ballast { get; set; }
        public string GlovesType { get; set; }
        public string DivingType { get; set; }
        public string Comment { get; set; }
    }
}
