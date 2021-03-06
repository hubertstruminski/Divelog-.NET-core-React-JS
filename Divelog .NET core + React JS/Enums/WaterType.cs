﻿using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Enums
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum WaterType
    {
        [EnumMember(Value = "SWEET")]
        SWEET,
        [EnumMember(Value = "SALT")]
        SALT,
        [EnumMember(Value = "NONE")]
        NONE
    }
}
