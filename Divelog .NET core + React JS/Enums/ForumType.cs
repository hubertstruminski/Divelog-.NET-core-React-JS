using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;

namespace Divelog_.NET_core___React_JS.Enums
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum ForumType
    {
        [EnumMember(Value = "ENGLISH")]
        ENGLISH,
        [EnumMember(Value = "POLISH")]
        POLISH,
        [EnumMember(Value = "GERMANY")]
        GERMANY
    }
}


