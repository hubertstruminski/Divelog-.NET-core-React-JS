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
    public class MarkerController : Controller
    {
        public MarkerController(IMarkerRepository markerRepository, ILogbookRepository logbookRepository, IJwtTokenProvider jwtTokenProvider, IClaimsConverter claimsConverter)
        {
            _markerRepository = markerRepository;
            _logbookRepository = logbookRepository;
            _jwtTokenProvider = jwtTokenProvider;
            _claimsConverter = claimsConverter;
        }

        public IMarkerRepository _markerRepository { get; set; }
        public ILogbookRepository _logbookRepository { get; set; }
        public IJwtTokenProvider _jwtTokenProvider { get; set; }
        public IClaimsConverter _claimsConverter { get; set; }

        [Route("add/marker")]
        [HttpPost]
        public ActionResult AddMarker([FromBody] Marker marker)
        {
            string jwtToken = RetrieveJwtToken();

            if(_jwtTokenProvider.ValidateToken(jwtToken))
            {
                Connection foundUser = _claimsConverter.findUser(jwtToken);

                if(foundUser == null)
                {
                    return BadRequest();
                }
                marker.User = foundUser;
                _markerRepository.Save(marker);

                return Ok();
            }
            return BadRequest();
        }

        [Route("get/markers")]
        [Produces("application/json")]
        [HttpGet]
        public ActionResult GetAllMarkers()
        {
            string jwtToken = RetrieveJwtToken();
            Connection foundUser = _claimsConverter.findUser(jwtToken);

            if (foundUser == null)
            {
                return NotFound();
            }
            List<Marker> markersList = _markerRepository.FindAllByUser(foundUser);
            return Json(markersList);
        }

        [Route("delete/marker/{markerID}")]
        [HttpDelete]
        public ActionResult deleteMarker(long markerID)
        {
            string jwtToken = RetrieveJwtToken();
            Connection foundUser = _claimsConverter.findUser(jwtToken);

            if(foundUser == null)
            {
                return NotFound();
            }
            Marker marker = _markerRepository.FindByIdAndUser(markerID, foundUser);
            Logbook foundLogbook = _logbookRepository.FindByMarker(marker);

            if(foundLogbook != null)
            {
                return BadRequest();
            }
            _markerRepository.DeleteByIdAndUser(markerID, foundUser);
            return Ok();
        }

        private string RetrieveJwtToken()
        {
            StringValues jwtToken;
            HttpContext.Request.Headers.TryGetValue("Authorization", out jwtToken);
            return jwtToken.ToString();
        }
    }
}