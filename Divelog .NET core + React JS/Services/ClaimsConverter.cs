using Divelog_.NET_core___React_JS.Config;
using Divelog_.NET_core___React_JS.Models;
using Divelog_.NET_core___React_JS.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Services
{
    public class ClaimsConverter : IClaimsConverter
    {
        public ClaimsConverter(IConnectionRepository connectionRepository, IJwtTokenProvider jwtTokenProvider)
        {
            _connectionRepository = connectionRepository;
            _jwtTokenProvider = jwtTokenProvider;
        }

        public IConnectionRepository _connectionRepository { get; set; }
        public IJwtTokenProvider _jwtTokenProvider { get; set; }

        public Connection findUser(string jwtToken)
        {
            ClaimsIdentity identity = _jwtTokenProvider.GetClaimsFromJwtToken(jwtToken);

            long userId = Convert.ToInt64(identity.FindFirst("userID").Value.ToString());
            long twitterUserId = Convert.ToInt64(identity.FindFirst("twitterUserID").Value.ToString());
            string email = identity.FindFirst(ClaimTypes.Email).Value.ToString();

            return _connectionRepository.findByUserIdOrTwitterUserIdOrEmail(userId, twitterUserId, email);
        }
    }
}
