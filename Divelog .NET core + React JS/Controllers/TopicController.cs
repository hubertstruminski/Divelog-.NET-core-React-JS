using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Divelog_.NET_core___React_JS.Config;
using Divelog_.NET_core___React_JS.Dto;
using Divelog_.NET_core___React_JS.Enums;
using Divelog_.NET_core___React_JS.Models;
using Divelog_.NET_core___React_JS.Repositories;
using Divelog_.NET_core___React_JS.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace Divelog_.NET_core___React_JS.Controllers
{
    public class TopicController : Controller
    {
        public TopicController(IJwtTokenProvider jwtTokenProvider, 
            IClaimsConverter claimsConverter, 
            ITopicRepository topicRepository, 
            ICustomFileRepository fileRepository, 
            IPostRepository postRepository,
            ITopicVoteRepository topicVoteRepository)
        {
            _jwtTokenProvider = jwtTokenProvider;
            _claimsConverter = claimsConverter;
            _topicRepository = topicRepository;
            _fileRepository = fileRepository;
            _postRepository = postRepository;
            _topicVoteRepository = topicVoteRepository;
        }

        public IJwtTokenProvider _jwtTokenProvider { get; set; }
        public IClaimsConverter _claimsConverter { get; set; }
        public ITopicRepository _topicRepository { get; set; }
        public ICustomFileRepository _fileRepository { get; set; }
        public IPostRepository _postRepository { get; set; }
        public ITopicVoteRepository _topicVoteRepository { get; set; }

        [Route("add/topic")]
        [HttpPost]
        public ActionResult addTopicToForum([FromBody] Topic topic)
        {
            string jwtToken = RetrieveJwtToken();
            Connection foundUser = _claimsConverter.findUser(jwtToken);

            if(foundUser != null)
            {
                Topic newTopic = new Topic();

                newTopic.Title = topic.Title;
                newTopic.Message = topic.Message;
                newTopic.LanguageForum = (ForumType)Enum.Parse(typeof(ForumType), topic.LanguageForum.ToString());
                newTopic.Likes = 0;
                newTopic.User = foundUser;
                newTopic.Displays = 0;
                newTopic.CreatedAt = DateTime.Now;

                _topicRepository.Save(newTopic);

                if(topic.Files.Count != 0)
                {
                    foreach(CustomFile file in topic.Files)
                    {
                        _fileRepository.Save(file);
                    }
                }
                return Ok();
            }
            return BadRequest();
        }

        [Route("get/topics/all")]
        [HttpGet]
        public ActionResult GetAllTopics()
        {
            return Json(_topicRepository.FindAllAndOrderByCreatedAtAsc());
        }

        [Route("get/topic/posts/{topicId}")]
        [HttpGet]
        public ActionResult GetTopicWithPostsById(long topicId)
        {
            Topic topic = AssingFilesToTopic(topicId, false);

            if(topic == null)
            {
                return BadRequest();
            }

            List<Post> posts = _postRepository.GetAllByTopicOrderByCreatedAtAsc(topic);
            foreach(Post post in posts)
            {
                List<CustomFile> postFiles = _fileRepository.GetAllByPost(post);
                post.Files = postFiles;
            }
            topic.Posts = posts;
            return Json(topic);
        }

        [Route("get/topic/number/comments/{topicId}")]
        [HttpGet]
        public ActionResult FetchNumberOfComments(long topicId)
        {
            string jwtToken = RetrieveJwtToken();
            Connection foundUser = _claimsConverter.findUser(jwtToken);

            Topic topic = _topicRepository.GetById(topicId);

            if(topic == null)
            {
                return BadRequest();
            }

            List<Post> posts = _postRepository.GetAllByTopic(topic);

            TopicVote topicVote = _topicVoteRepository.GetByTopicAndUser(topic, foundUser);

            TopicTemplate topicTemplate = null;
            if (topicVote == null)
            {
                topicTemplate = new TopicTemplate(topic.Displays, posts.Count, topic.Likes, 0);
            }
            else
            {
                topicTemplate = new TopicTemplate(topic.Displays, posts.Count, topic.Likes, topicVote.Vote);
            }
            return Json(topicTemplate);
        }

        [Route("get/topic/{topicId}")]
        [HttpGet]
        public ActionResult GetTopicById(long topicId)
        {
            Topic topic = AssingFilesToTopic(topicId, true);
            if(topic == null)
            {
                return BadRequest();
            }
            return Json(topic);
        }
        
        [Route("update/topic/{topicId}")]
        [HttpPut]
        public ActionResult UpdateTopicById([FromBody] Topic topicDto, long topicId)
        {
            string jwtToken = RetrieveJwtToken();
            Connection foundUser = _claimsConverter.findUser(jwtToken);

            if(foundUser == null)
            {
                return NotFound();
            }

            Topic topic = _topicRepository.GetByIdAndUser(topicId, foundUser);

            if(topic != null)
            {
                topic.Title = topicDto.Title;
                topic.Message = topicDto.Message;

                foreach(CustomFile fileDto in topicDto.Files)
                {
                    CustomFile file = new CustomFile();

                    file.Post = null;
                    file.ObjectId = fileDto.ObjectId;
                    file.Size = fileDto.Size;
                    file.Topic = topic;
                    file.Type = fileDto.Type;
                    file.Url = fileDto.Url;
                    file.Name = fileDto.Name;

                    _fileRepository.Save(file);
                }
                _topicRepository.Update(topic);
                return Ok();
            }
            return BadRequest();
        }

        [Route("get/top/topics/all")]
        public ActionResult GetAllTopTopics()
        {
            return Json(_topicRepository.FindAllAndOrderByLikeDesc());
        }

        private string RetrieveJwtToken()
        {
            StringValues jwtToken;
            HttpContext.Request.Headers.TryGetValue("Authorization", out jwtToken);
            return jwtToken.ToString();
        }

        private Topic AssingFilesToTopic(long topicId, Boolean isUpdating)
        {
            Topic topic = _topicRepository.GetById(topicId);

            if(topic == null)
            {
                return null;
            }

            if(!isUpdating)
            {
                int displays = topic.Displays + 1;
                topic.Displays = displays;
                _topicRepository.Update(topic);
            }

            List<CustomFile> customFiles = _fileRepository.GetAllByTopic(topic);
            topic.Files = customFiles;

            return topic;
        }
    }
}