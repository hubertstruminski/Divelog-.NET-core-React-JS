using Divelog_.NET_core___React_JS.Dto;
using Divelog_.NET_core___React_JS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Config
{
    public interface IJwtTokenProvider
    {
        string GenerateToken(Connection user);
        string GenerateTokenForTwitter(ConnectionDto user);
        string GenerateSecretKey();
        ClaimsIdentity SetClaims(Connection user, ConnectionDto connectionDto);
        bool ValidateToken(string jwtToken);
        ClaimsPrincipal GetPrincipal(string token);
        long SetDateTimeToMiliseconds(string createdAt);
        ClaimsIdentity GetClaimsFromJwtToken(string jwtToken);
    }
}
