using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Divelog_.NET_core___React_JS.Config;
using Divelog_.NET_core___React_JS.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace Divelog_.NET_core___React_JS.Controllers
{
    public class LogInController : Controller
    {
        public LogInController(IJwtTokenProvider jwtTokenProvider)
        {
            _jwtTokenProvider = jwtTokenProvider;
        }
        public IJwtTokenProvider _jwtTokenProvider { get; set; }

        [Route("getuserdata")]
        [Produces("application/json")]
        [HttpGet]
        public ActionResult GetUserData()
        {
            StringValues jwtToken;
            HttpContext.Request.Headers.TryGetValue("Authorization", out jwtToken);

            if (_jwtTokenProvider.ValidateToken(jwtToken.ToString()))
            {
                ClaimsIdentity identity = _jwtTokenProvider.GetClaimsFromJwtToken(jwtToken);

                CustomClaim customClaim = new CustomClaim();

                customClaim.Name = identity.FindFirst("name").Value.ToString();
                customClaim.PictureUrl = identity.FindFirst("pictureUrl").Value.ToString();
                customClaim.ScreenName = identity.FindFirst("screenName").Value.ToString();

                return Json(customClaim);
            }
            return NotFound();
        }
    }
}