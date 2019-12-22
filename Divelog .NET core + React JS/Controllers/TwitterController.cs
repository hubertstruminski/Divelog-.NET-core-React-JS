using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Divelog_.NET_core___React_JS.Enums;
using Divelog_.NET_core___React_JS.Models;
using Divelog_.NET_core___React_JS.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tweetinvi;
using Tweetinvi.Models;

namespace Divelog_.NET_core.Controllers
{
    public class TwitterController : ControllerBase
    {
        private IAuthenticationContext _authenticationContext;

        public TwitterController(IConnectionRepository connectionRepository, ICustomTwitterRepository customTwitterRepository)
        {
            _connectionRepository = connectionRepository;
            _customTwitterRepository = customTwitterRepository;
        }
        
        public IConnectionRepository _connectionRepository { get; set; }
        public ICustomTwitterRepository _customTwitterRepository { get; set; }

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

            string jwtToken = null;

            if(foundUser == null)
            {
                Connection connection = new Connection();
                connection = setUserInfo(connection, accessToken, user.Id, user.Email, user.ProfileImageUrl400x400, user.Name);
                connection.CreatedAt = new DateTime();
                //connection.UserID = ;

                CustomTwitter customTwitter = new CustomTwitter();

                _connectionRepository.Save(connection);
                setTwitter(connection, accessTokenSecret, user.ScreenName, customTwitter);
            } 
            else
            {

            }
            return Ok("");
        }

        private Connection setUserInfo(Connection connection, string accessToken, long twitterUserId, string email, string pictureUrl, string name)
        {
            connection.TwitterUserId = twitterUserId;
            connection.ProviderId = Provider.TWITTER.ToString();
            connection.Email = email;
            connection.PictureUrl = pictureUrl;
            connection.LoggedAt = new DateTime();
            connection.Name = name;
            connection.AccessToken = accessToken;
            connection.IsAuthenticated = true;

            return connection;
        }

        private void setTwitter(Connection connection, string tokenSecret, string screenName, CustomTwitter customTwitter)
        {
            customTwitter.User = connection;
            customTwitter.tokenSecret = tokenSecret;
            customTwitter.screenName = screenName;

            _customTwitterRepository.Save(customTwitter);
        }
    }
}