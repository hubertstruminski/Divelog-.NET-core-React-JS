using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Divelog_.NET_core___React_JS.Config;
using Divelog_.NET_core___React_JS.Dto;
using Divelog_.NET_core___React_JS.Models;
using Divelog_.NET_core___React_JS.Repositories;
using Divelog_.NET_core___React_JS.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace Divelog_.NET_core___React_JS.Controllers
{
    public class PostController : Controller
    {
        public PostController(IJwtTokenProvider jwtTokenProvider,
            IClaimsConverter claimsConverter,
            ITopicRepository topicRepository,
            ICustomFileRepository fileRepository,
            IPostRepository postRepository)
        {
            _jwtTokenProvider = jwtTokenProvider;
            _claimsConverter = claimsConverter;
            _topicRepository = topicRepository;
            _fileRepository = fileRepository;
            _postRepository = postRepository;
        }

        public IJwtTokenProvider _jwtTokenProvider { get; set; }
        public IClaimsConverter _claimsConverter { get; set; }
        public ITopicRepository _topicRepository { get; set; }
        public ICustomFileRepository _fileRepository { get; set; }
        public IPostRepository _postRepository { get; set; }

        [Route("add/post")]
        [HttpPost]
        public ActionResult AddPost([FromBody] PostDto postDto)
        {
            string jwtToken = RetrieveJwtToken();
            Connection foundUser = _claimsConverter.findUser(jwtToken);

            Topic topic = _topicRepository.GetById(postDto.topicId);

            if(foundUser != null && topic != null)
            {
                Post post = new Post();

                post.Message = postDto.Message;
                post.Topic = topic;
                post.CreatedAt = DateTime.Now;
                post.User = foundUser;

                _postRepository.Save(post);

                foreach(CustomFile file in postDto.Files)
                {
                    file.Topic = topic;
                    file.Post = post;

                    _fileRepository.Save(file);
                }
                return Ok();
            }
            return BadRequest();
        }

        [Route("delete/post/{postId}")]
        public ActionResult DeletePostById(long postId)
        {
            string jwtToken = RetrieveJwtToken();
            Connection foundUser = _claimsConverter.findUser(jwtToken);

            Post post = _postRepository.GetByIdAndUser(postId, foundUser);

            if(foundUser != null && post != null)
            {
                List<CustomFile> customFiles = _fileRepository.GetAllByPost(post);

                if(customFiles.Count != 0)
                {
                    foreach(CustomFile file in customFiles)
                    {
                        _fileRepository.Delete(file);
                    }
                }
                _postRepository.DeleteById(postId);
                return Ok();
            }
            return BadRequest();
        }

        [Route("post/{postId}")]
        [HttpPut]
        public ActionResult UpdatePostById([FromBody] PostDto postDto, long postId)
        {
            string jwtToken = RetrieveJwtToken();
            Connection foundUser = _claimsConverter.findUser(jwtToken);

            Post post = _postRepository.GetByIdAndUser(postId, foundUser);

            if(post != null && foundUser != null)
            {
                post.Message = postDto.Message;
                post.UpdatedAt = DateTime.Now;

                _postRepository.Update(post);

                foreach (CustomFile file in postDto.Files)
                {
                    file.Topic = null;
                    file.Post = post;

                    _fileRepository.Save(file);
                }
                return Ok();
            }
            return BadRequest();
        } 

        private string RetrieveJwtToken()
        {
            StringValues jwtToken;
            HttpContext.Request.Headers.TryGetValue("Authorization", out jwtToken);
            return jwtToken.ToString();
        }
    }
}