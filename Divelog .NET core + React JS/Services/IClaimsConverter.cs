using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Services
{
    public interface IClaimsConverter
    {
        Connection findUser(string jwtToken);
    }
}
