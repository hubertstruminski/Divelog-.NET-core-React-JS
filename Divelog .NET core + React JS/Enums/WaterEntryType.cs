using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Enums
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum WaterEntryType
    {
        [EnumMember(Value = "COAST")]
        COAST,
        [EnumMember(Value = "BOAT")]
        BOAT,
        [EnumMember(Value = "NONE")]
        NONE
    }
}
