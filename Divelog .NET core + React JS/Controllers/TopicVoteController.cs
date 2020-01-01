using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Divelog_.NET_core___React_JS.Config;
using Divelog_.NET_core___React_JS.Models;
using Divelog_.NET_core___React_JS.Repositories;
using Divelog_.NET_core___React_JS.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace Divelog_.NET_core___React_JS.Controllers
{
    public class TopicVoteController : Controller
    {
        public TopicVoteController(IJwtTokenProvider jwtTokenProvider, IClaimsConverter claimsConverter, ITopicRepository topicRepository, ITopicVoteRepository topicVoteRepository)
        {
            _jwtTokenProvider = jwtTokenProvider;
            _claimsConverter = claimsConverter;
            _topicRepository = topicRepository;
            _topicVoteRepository = topicVoteRepository;
        }

        public IJwtTokenProvider _jwtTokenProvider { get; set; }
        public IClaimsConverter _claimsConverter { get; set; }
        public ITopicRepository _topicRepository { get; set; }
        public ITopicVoteRepository _topicVoteRepository { get; set; }

        [Route("topic/likes/vote/{topicId}")]
        [HttpPut]
        public ActionResult voteForTopic([FromBody] bool isUpVoted, long topicId)
        {
            string jwtToken = RetrieveJwtToken();
            Connection foundUser = _claimsConverter.findUser(jwtToken);

            Topic topic = _topicRepository.GetById(topicId);

            if (topic == null)
            {
                return BadRequest();
            }

            TopicVote topicVote = _topicVoteRepository.GetByTopic(topic);

            if (topicVote != null)
            {
                SetVoteForTopicVote(isUpVoted, topicVote, topic);
                topicVote.User = foundUser;
                _topicVoteRepository.Update(topicVote);

                return Ok();
            }
            else
            {
                TopicVote newTopicVote = new TopicVote();

                SetVoteForTopicVote(isUpVoted, newTopicVote, topic);
                newTopicVote.Topic = topic;
                newTopicVote.User = foundUser;
                _topicVoteRepository.Save(newTopicVote);

                return Ok();
            }
        }

        private string RetrieveJwtToken()
        {
            StringValues jwtToken;
            HttpContext.Request.Headers.TryGetValue("Authorization", out jwtToken);
            return jwtToken.ToString();
        }

        private void SetVoteForTopicVote(bool isUpVoted, TopicVote topicVote, Topic topic)
        {
            int likes = topic.Likes;
            if (isUpVoted)
            {
                if (topicVote.Vote == 0)
                {
                    topicVote.Vote = 1;
                }
                else if (topicVote.Vote == -1)
                {
                    topicVote.Vote = 0;
                }
                likes++;
            }
            else
            {
                if (topicVote.Vote == 0)
                {
                    topicVote.Vote = -1;
                }
                else if (topicVote.Vote == 1)
                {
                    topicVote.Vote = 0;
                }
                likes--;
            }
            topic.Likes = likes;
            _topicRepository.Update(topic);
        }
    }
}