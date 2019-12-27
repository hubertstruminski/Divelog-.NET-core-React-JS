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
    public enum GloveType
    {
        [EnumMember(Value = "WET")]
        WET,
        [EnumMember(Value = "DRY")]
        DRY,
        [EnumMember(Value = "NONE")]
        NONE
    }
}
