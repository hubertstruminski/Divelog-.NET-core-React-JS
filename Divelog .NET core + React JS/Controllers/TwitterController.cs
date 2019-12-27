using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
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
using Tweetinvi.Parameters;

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

        [Route("twitter/users/search/{searchInput}")]
        [Produces("application/json")]
        [HttpPost]
        public JsonResult FindTwitterPeople(string searchInput)
        {
            SetTwitterCredentials();

            var users = Search.SearchUsers(searchInput);
            return Json(users);
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

        [Route("twitter/friends/list")]
        [HttpGet]
        public JsonResult GetFriendsList()
        {
            SetTwitterCredentials();

            StringValues jwtToken;
            var headers = HttpContext.Request.Headers.TryGetValue("Authorization", out jwtToken);

            ClaimsIdentity identity = _jwtTokenProvider.GetClaimsFromJwtToken(jwtToken.ToString());

            long twitterUserId = Convert.ToInt64(identity.FindFirst("twitterUserID").Value.ToString());

            var followers = Tweetinvi.User.GetFollowers(twitterUserId, Int32.MaxValue);

            return Json(followers);
        }

        [Route("twitter/home/timeline")]
        [HttpGet]
        public JsonResult GetHomeTimeline()
        {
            SetTwitterCredentials();

            IEnumerable<ITweet> homeTimeline = Timeline.GetHomeTimeline();
            StringBuilder builder = new StringBuilder();

            foreach(ITweet tweet in homeTimeline)
            {
                builder = CreateOEmbedTweet(tweet, builder);
            }
            return Json(builder.ToString());
        }

        [Route("twitter/create/tweet")]
        [HttpPost]
        public ActionResult CreateTweet([FromBody] TweetDto tweetDto)
        {
            List<IMedia> medias = new List<IMedia>();

            if (tweetDto.Files.Count > 0)
            {
                foreach(TweetFileDto file in tweetDto.Files)
                {
                    using (var webClient = new WebClient())
                    {
                        byte[] imageBytes = webClient.DownloadData(file.Url);
                        var media = Upload.UploadBinary(imageBytes);
                        medias.Add(media);
                    }
                }
            }

            var tweet = Tweet.PublishTweet(tweetDto.Message, new PublishTweetOptionalParameters
            {
                Medias = medias
            });
            
            if(tweet == null)
            {
                return BadRequest();
            }
            return Ok(); 
        }

        [Route("twitter/search/tweets")]
        [HttpPost]
        public ActionResult GetSearchTweets([FromBody] string query)
        {
            SetTwitterCredentials();

            IEnumerable<ITweet> searchedTweets = Search.SearchTweets(query);
            StringBuilder builder = new StringBuilder();

            foreach(ITweet tweet in searchedTweets)
            {
                builder = CreateOEmbedTweet(tweet, builder);
            }
            return Json(builder.ToString());
        }

        // nieprzetestowane
        [Route("twitter/direct/messages")]
        [HttpGet]
        public ActionResult GetDirectMessages()
        {
            SetTwitterCredentials();

            IEnumerable<IMessage> directMessages = GetDirectMessagesByRestApi();

            HashSet<TwitterInboxDto> messagesSet = new HashSet<TwitterInboxDto>();
            List<long> recipientIds = new List<long>();
            List<long> senderIds = new List<long>();

            foreach(IMessage message in directMessages)
            {
                if(CheckIfConversationExist(senderIds, recipientIds, message))
                {
                    TwitterInboxDto twitterInboxDto = new TwitterInboxDto();

                    twitterInboxDto.RecipientId = message.RecipientId.ToString();
                    twitterInboxDto.SenderId = message.SenderId.ToString();
                    twitterInboxDto.CreatedAt = message.CreatedAt;
                    twitterInboxDto.Text = message.Text;

                    var user = Tweetinvi.User.GetUserFromId(message.RecipientId);
                    twitterInboxDto.Name = user.Name;
                    twitterInboxDto.ScreenName = user.ScreenName;
                    twitterInboxDto.PictureUrl = user.ProfileImageUrl400x400;

                    messagesSet.Add(twitterInboxDto);
                    recipientIds.Add(message.RecipientId);
                    senderIds.Add(message.SenderId);

                }
            }
            return Json(messagesSet);
        }

        // nieprzetestowane
        [Route("twitter/direct/messages/specified/person")]
        [HttpPost]
        public ActionResult GetDirectMessagesWithSpecifiedPerson([FromBody] RecipientSender recipientSender)
        {
            SetTwitterCredentials();

            StringValues jwtToken;
            HttpContext.Request.Headers.TryGetValue("Authorization", out jwtToken);

            ClaimsIdentity identity = _jwtTokenProvider.GetClaimsFromJwtToken(jwtToken.ToString());
            long twitterUserId = Convert.ToInt64(identity.FindFirst("twitterUserID").Value.ToString());

            IEnumerable<IMessage> directMessages = GetDirectMessagesByRestApi();
            List<SingleDirectMessage> privateMessages = new List<SingleDirectMessage>();

            foreach(IMessage message in directMessages)
            {
                if(CheckIfMessagesFromSpecifiedPerson(recipientSender, message))
                {
                    SingleDirectMessage singleMessage = new SingleDirectMessage();

                    singleMessage.Id = message.Id;
                    singleMessage.Text = message.Text;
                    singleMessage.SenderId = message.SenderId;
                    singleMessage.RecipientId = message.RecipientId;
                    singleMessage.CreatedAt = message.CreatedAt;
                    singleMessage.TwitterOwnerId = twitterUserId;

                    singleMessage.EntityUrls = message.Entities.Urls;

                    privateMessages.Add(singleMessage);
                }
            }
            return Json(privateMessages);
        }

        [Route("twitter/direct/messages/search/people")]
        [HttpPost]
        public ActionResult SearchPeopleToStartConversations([FromBody] string searchInput)
        {
            SetTwitterCredentials();

            StringValues jwtToken;
            HttpContext.Request.Headers.TryGetValue("Authorization", out jwtToken);

            ClaimsIdentity identity = _jwtTokenProvider.GetClaimsFromJwtToken(jwtToken.ToString());

            long twitterUserId = Convert.ToInt64(identity.FindFirst("twitterUserID").Value.ToString());

            IEnumerable<IUser> users = Search.SearchUsers(searchInput);
            List<ContactDirectMessage> contacts = new List<ContactDirectMessage>();

            int count = 0;
            foreach(IUser user in users)
            {
                if(count == 5)
                {
                    break;
                }
                IRelationshipDetails relationship = Friendship.GetRelationshipDetailsBetween(twitterUserId, user.Id);

                ContactDirectMessage contact = new ContactDirectMessage();

                contact.Name = user.Name;
                contact.ScreenName = user.ScreenName;
                contact.PictureUrl = user.ProfileImageUrl400x400;

                if(relationship.CanSendDirectMessage)
                {
                    contact.IsDMAccessible = true;
                } 
                else
                {
                    contact.IsDMAccessible = false;
                }
                contacts.Add(contact);
                count++;
            }
            return Json(contacts);
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

        private bool CheckIfConversationExist(List<long> senderIds, List<long> recipientIds, IMessage message)
        {
            return (recipientIds.Contains(message.RecipientId) && senderIds.Contains(message.SenderId)) ||
                (recipientIds.Contains(message.SenderId) && senderIds.Contains(message.RecipientId));
        }

        private bool CheckIfMessagesFromSpecifiedPerson(RecipientSender recipientSender, IMessage message)
        {
            return (recipientSender.RecipientId.Equals(message.RecipientId.ToString()) && recipientSender.SenderId.Equals(message.SenderId.ToString())) ||
                (recipientSender.SenderId.Equals(message.RecipientId.ToString()) && recipientSender.RecipientId.Equals(message.SenderId.ToString()));
        }

        private IEnumerable<IMessage> GetDirectMessagesByRestApi()
        {
            var messages = Message.GetLatestMessages(new GetMessagesParameters()
            {
                Count = 50
            }, out var nextCursor).ToList();

            if (nextCursor != null)
            {
                var olderMessages = Message.GetLatestMessages(new GetMessagesParameters()
                {
                    Count = 50,
                    Cursor = nextCursor
                });

                messages.AddRange(olderMessages);
            }

            IEnumerable<IMessage> directMessages = messages;
            return directMessages;
        }

        private StringBuilder CreateOEmbedTweet(ITweet tweet, StringBuilder builder)
        {
            IOEmbedTweet oEmbedTweet = Tweet.GetOEmbedTweet(tweet);
            if(oEmbedTweet == null)
            {
                return builder.Append("");
            }
            return builder.Append(oEmbedTweet.HTML);
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
            customTwitter.TokenSecret = tokenSecret;
            customTwitter.ScreenName = screenName;

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

            connectionDto.tokenSecret = twitter.TokenSecret;
            connectionDto.screenName = twitter.ScreenName;

            return connectionDto;
        }
    }
}