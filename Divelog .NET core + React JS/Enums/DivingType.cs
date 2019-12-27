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
    public enum DivingType
    {
        [EnumMember(Value = "RECREATIONAL")]
        RECREATIONAL,
        [EnumMember(Value = "TECHNICAL")]
        TECHNICAL,
        [EnumMember(Value = "CAVE")]
        CAVE,
        [EnumMember(Value = "WRECK")]
        WRECK,
        [EnumMember(Value = "NONE")]
        NONE
    }
}
