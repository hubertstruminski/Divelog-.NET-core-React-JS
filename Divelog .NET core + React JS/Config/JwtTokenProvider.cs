using Divelog_.NET_core___React_JS.Dto;
using Divelog_.NET_core___React_JS.Models;
using Divelog_.NET_core___React_JS.Repositories;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace Divelog_.NET_core___React_JS.Config
{
    public class JwtTokenProvider : IJwtTokenProvider
    {
        public IConnectionRepository _connectionRepository { get; set; }

        public JwtTokenProvider(IConnectionRepository connectionRepository)
        {
            _connectionRepository = connectionRepository;
        }

        public string GenerateToken(Connection user)
        {
            var symmetricKey = Convert.FromBase64String(SecurityConstants.SECRET_KEY);

            var tokenHandler = new JwtSecurityTokenHandler();

            var now = DateTime.UtcNow;
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = SetClaims(user, null),

                Expires = now.AddMinutes(Convert.ToInt32(30)),

                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(symmetricKey),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var stoken = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(stoken);
        }

        public string GenerateTokenForTwitter(ConnectionDto user)
        {
            var symmetricKey = Convert.FromBase64String(SecurityConstants.SECRET_KEY);

            var tokenHandler = new JwtSecurityTokenHandler();

            var now = DateTime.UtcNow;
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = SetClaims(null, user),

                Expires = now.AddMinutes(Convert.ToInt32(30)),

                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(symmetricKey),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var stoken = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(stoken);
        }

        public bool ValidateToken(string jwtToken)
        {
            var principal = GetPrincipal(jwtToken);
            var identity = principal.Identity as ClaimsIdentity;

            if (identity == null)
            {
                return false;
            }

            long userId = 0;
            long twitterUserId = 0;
            string tokenSecret;
            string screenName;

            if (identity.FindFirst("twitterUserID") == null && identity.FindFirst("userID") == null)
            {
                return false;
            }

            if(identity.FindFirst("twitterUserID") != null)
            {
                screenName = identity.FindFirst("screenName").Value.ToString();
                tokenSecret = identity.FindFirst("tokenSecret").Value.ToString();
                twitterUserId = Convert.ToInt64(identity.FindFirst("twitterUserID").Value.ToString());
            }

            if(identity.FindFirst("userID") != null)
            {
                userId = Convert.ToInt64(identity.FindFirst("userID").Value.ToString());
            }

            string email = identity.FindFirst(ClaimTypes.Email).Value.ToString();
            string accessToken = identity.FindFirst("accessToken").Value.ToString();
            string createdAt = identity.FindFirst("createdAt").Value.ToString();
            string loggedAt = identity.FindFirst("loggedAt").Value.ToString();

            long createdAtMiliseconds = SetDateTimeToMiliseconds(createdAt);
            long loggedAtMiliseconds = SetDateTimeToMiliseconds(loggedAt);

            Connection user = _connectionRepository.findByUserIdOrTwitterUserId(userId, twitterUserId);

            long userCreatedAtMiliseconds = SetDateTimeToMiliseconds(user.CreatedAt.ToString());
            long userLoggedAtMiliseconds = SetDateTimeToMiliseconds(user.LoggedAt.ToString());

            if (user.Email.Equals(email) && user.AccessToken.Equals(accessToken) && createdAtMiliseconds == userCreatedAtMiliseconds && loggedAtMiliseconds == userLoggedAtMiliseconds)
            {
                return true;
            }
            return false;
        }

        public ClaimsPrincipal GetPrincipal(string token)
        {

            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

            if (jwtToken == null)
                return null;

            var symmetricKey = Convert.FromBase64String(SecurityConstants.SECRET_KEY);

            var validationParameters = new TokenValidationParameters()
            {
                RequireExpirationTime = true,
                ValidateIssuer = false,
                ValidateAudience = false,
                IssuerSigningKey = new SymmetricSecurityKey(symmetricKey)
            };

            SecurityToken securityToken;
            return tokenHandler.ValidateToken(token, validationParameters, out securityToken);
        }

        public ClaimsIdentity GetClaimsFromJwtToken(string jwtToken)
        {
            var principal = GetPrincipal(jwtToken);
            return principal.Identity as ClaimsIdentity;
        }

        public string GenerateSecretKey()
        {
            var hmac = new HMACSHA256();
            return Convert.ToBase64String(hmac.Key);
        }

        public ClaimsIdentity SetClaims(Connection user, ConnectionDto connectionDto)
        {
            if(user == null)
            {
                user = connectionDto;
                return new ClaimsIdentity(new[]
                {
                    new Claim("userID", user.UserID.ToString()),
                    new Claim("twitterUserID", user.TwitterUserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email.ToString()),
                    new Claim("name", user.Name.ToString()),
                    new Claim("accessToken", user.AccessToken.ToString()),
                    new Claim("pictureUrl", user.PictureUrl.ToString()),
                    new Claim("providerId", user.ProviderId.ToString()),
                    new Claim("createdAt", user.CreatedAt.ToString()),
                    new Claim("loggedAt", user.LoggedAt.ToString()),
                    new Claim("screenName", connectionDto.screenName.ToString()),
                    new Claim("tokenSecret", connectionDto.tokenSecret.ToString())
                });
            }

            return new ClaimsIdentity(new[]
            {
                new Claim("userID", user.UserID.ToString()),
                new Claim("twitterUserID", user.TwitterUserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email.ToString()),
                new Claim("name", user.Name.ToString()),
                new Claim("accessToken", user.AccessToken.ToString()),
                new Claim("pictureUrl", user.PictureUrl.ToString()),
                new Claim("providerId", user.ProviderId.ToString()),
                new Claim("createdAt", user.CreatedAt.ToString()),
                new Claim("loggedAt", user.LoggedAt.ToString()),
            });
        }

        public long SetDateTimeToMiliseconds(string createdAt)
        {
            string format = "dd/MM/yyyy HH:mm:ss";

            DateTime createdAtFormat = DateTime.ParseExact(createdAt, format, null);

            long createdAtMiliseconds = new DateTimeOffset(createdAtFormat).ToUnixTimeMilliseconds();
            return createdAtMiliseconds;
        }
    }
}
