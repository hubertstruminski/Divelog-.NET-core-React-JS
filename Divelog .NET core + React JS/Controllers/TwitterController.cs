using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Divelog_.NET_core___React_JS.Config;
using Divelog_.NET_core___React_JS.Dto;
using Divelog_.NET_core___React_JS.Enums;
using Divelog_.NET_core___React_JS.Models;
using Divelog_.NET_core___React_JS.Repositories;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Tweetinvi;
using Tweetinvi.Models;

namespace Divelog_.NET_core.Controllers
{
    public class TwitterController : Controller
    {
        private IAuthenticationContext _authenticationContext;

        public TwitterController(IConnectionRepository connectionRepository, ICustomTwitterRepository customTwitterRepository, IJwtTokenProvider jwtTokenProvider)
        {
            _connectionRepository = connectionRepository;
            _customTwitterRepository = customTwitterRepository;
            _jwtTokenProvider = jwtTokenProvider;
        }
        
        public IConnectionRepository _connectionRepository { get; set; }
        public ICustomTwitterRepository _customTwitterRepository { get; set; }
        public IJwtTokenProvider _jwtTokenProvider { get; set; }

        [Route("twitter/signin")]
        [HttpGet]
        public IActionResult signinWithTwitter()
        {
            var appCreds = new ConsumerCredentials("todfC8BjhF9MbQ7VUeGY8EyWH", "ftDjrAI9KMaZOtYWpg0sZWGx6lqIq4Jhan7uokwMdC2yKHbDj2");

            // Specify the url you want the user to be redirected to
            var redirectURL = "https://" + Request.Host + "/twitter/callback";
            _authenticationContext = AuthFlow.InitAuthentication(appCreds, redirectURL);

            return new RedirectResult(_authenticationContext.AuthorizationURL);
        }

        [Route("twitter/callback")]
        [HttpGet]
        public IActionResult callbackTwitter()
        {
            var verifierCode = Request.Query["oauth_verifier"];
            var authorizationId = Request.Query["authorization_id"];

            var userCredentials = AuthFlow.CreateCredentialsFromVerifierCode(verifierCode, authorizationId);

            var accessToken = userCredentials.AccessToken;
            var accessTokenSecret = userCredentials.AccessTokenSecret;
            var user = Tweetinvi.User.GetAuthenticatedUser(userCredentials);
            
            if(accessToken == null || user == null)
            {
                return NotFound();
            }

            Connection foundUser = _connectionRepository.FindByTwitterUserIdOrEmail(user.Id, user.Email);

            string jwtToken;

            if(foundUser == null)
            {
                Connection connection = new Connection();
                connection = setUserInfo(connection, accessToken, user.Id, user.Email, user.ProfileImageUrl400x400, user.Name);
                connection.CreatedAt = DateTime.Now;

                CustomTwitter customTwitter = new CustomTwitter();

                _connectionRepository.Save(connection);
                setTwitter(connection, accessTokenSecret, user.ScreenName, customTwitter, false);

                jwtToken = _jwtTokenProvider.GenerateTokenForTwitter(setConnectionDtoForTwitterToken(connection, customTwitter));
            } 
            else
            {
                setUserInfo(foundUser, accessToken, user.Id, user.Email, user.ProfileImageUrl400x400, user.Name);
                _connectionRepository.Update(foundUser);

                CustomTwitter foundTwitter = _customTwitterRepository.findByUser(foundUser);

                if(foundTwitter == null)
                {
                    CustomTwitter customTwitter = new CustomTwitter();
                    setTwitter(foundUser, accessTokenSecret, user.ScreenName, customTwitter, false);

                    jwtToken = _jwtTokenProvider.GenerateTokenForTwitter(setConnectionDtoForTwitterToken(foundUser, customTwitter));
                }
                else
                {
                    setTwitter(foundUser, accessTokenSecret, user.ScreenName, foundTwitter, true);

                    jwtToken = _jwtTokenProvider.GenerateTokenForTwitter(setConnectionDtoForTwitterToken(foundUser, foundTwitter));
                }
            }
            return Redirect("http://localhost:3000/twitter/likes/" + jwtToken);
        }

        [Route("twitter/login/validate/token")]
        [HttpPost]
        public IActionResult validateJwtTokenForTwitterLogin([FromBody] string jwtToken)
        {
            if(_jwtTokenProvider.ValidateToken(jwtToken))
            {
                return Ok();
            }
            return BadRequest();
        }

        [EnableCors("MyPolicy")]
        [Route("twitter/available/closest/trends/{latitude}/{longitude}")]
        [Produces("application/json")]
        [HttpGet]
        public JsonResult getAvailableTrends(double latitude, double longitude)
        {
            SetTwitterCredentials();

            List<ITrendLocation> closestTrendLocations = Trends.GetClosestTrendLocations(latitude, longitude).ToList();

            List<ITrend> trends = null;
            foreach (ITrendLocation element in closestTrendLocations)
            {
                trends = Trends.GetTrendsAt(element.WoeId).Trends;
            }
            return Json(trends);
        }

        private void SetTwitterCredentials()
        {
            StringValues jwtToken;
            var headers = HttpContext.Request.Headers.TryGetValue("Authorization", out jwtToken);

            ClaimsIdentity identity = _jwtTokenProvider.GetClaimsFromJwtToken(jwtToken.ToString());

            string accessToken = identity.FindFirst("accessToken").Value.ToString();
            string tokenSecret = identity.FindFirst("tokenSecret").Value.ToString();

            Auth.SetUserCredentials("todfC8BjhF9MbQ7VUeGY8EyWH", "ftDjrAI9KMaZOtYWpg0sZWGx6lqIq4Jhan7uokwMdC2yKHbDj2", accessToken, tokenSecret);
        }

        private Connection setUserInfo(Connection connection, string accessToken, long twitterUserId, string email, string pictureUrl, string name)
        {
            connection.TwitterUserId = twitterUserId;
            connection.ProviderId = Provider.TWITTER.ToString();
            connection.Email = email;
            connection.PictureUrl = pictureUrl;
            connection.LoggedAt = DateTime.Now;
            connection.AccessToken = accessToken;
            connection.IsAuthenticated = true;
            connection.Name = name;

            return connection;
        }

        private void setTwitter(Connection connection, string tokenSecret, string screenName, CustomTwitter customTwitter, bool isUpdating)
        {
            customTwitter.User = connection;
            customTwitter.tokenSecret = tokenSecret;
            customTwitter.screenName = screenName;

            if(!isUpdating)
            {
                _customTwitterRepository.Save(customTwitter);
            }
            else
            {
                _customTwitterRepository.Update(customTwitter);
            }
            
        }

        private ConnectionDto setConnectionDtoForTwitterToken(Connection user, CustomTwitter twitter)
        {
            ConnectionDto connectionDto = new ConnectionDto();

            connectionDto.TwitterUserId = user.TwitterUserId;
            connectionDto.ProviderId = user.ProviderId;
            connectionDto.PictureUrl = user.PictureUrl;
            connectionDto.Name = user.Name;
            connectionDto.LoggedAt = user.LoggedAt;
            connectionDto.Email = user.Email;
            connectionDto.CreatedAt = user.CreatedAt;
            connectionDto.AccessToken = user.AccessToken;

            connectionDto.tokenSecret = twitter.tokenSecret;
            connectionDto.screenName = twitter.screenName;

            return connectionDto;
        }
    }
}