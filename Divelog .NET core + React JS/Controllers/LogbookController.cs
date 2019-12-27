using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
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
    public class LogbookController : Controller
    {
        public LogbookController(IMarkerRepository markerRepository, ILogbookRepository logbookRepository, IJwtTokenProvider jwtTokenProvider, IClaimsConverter claimsConverter)
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

        [Route("add/logbook")]
        [HttpPost]
        public ActionResult AddDiveToLogbook([FromBody] LogbookDto logbookDto)
        {
            string jwtToken = RetrieveJwtToken();

            Logbook logbook = convertDtoToLogbook(logbookDto);

            if(_jwtTokenProvider.ValidateToken(jwtToken))
            {
                Connection foundUser = _claimsConverter.findUser(jwtToken);

                if(foundUser == null)
                {
                    return NotFound();
                }
                SetTime(logbook, logbook);

                Marker marker = logbook.Marker;
                marker.User = foundUser;
                _markerRepository.Save(marker);

                logbook.User = foundUser;
                _logbookRepository.Save(logbook);

                return Ok();
            }
            return BadRequest();
        }

        [Route("get/logbook")]
        [HttpGet]
        public ActionResult GetDivesFromLogbook()
        {
            string jwtToken = RetrieveJwtToken();
            Connection foundUser = _claimsConverter.findUser(jwtToken);

            if(foundUser == null)
            {
                return NotFound();
            }
            List<Logbook> logbooks = _logbookRepository.FindAllByUser(foundUser);
            return Json(logbooks);
        }

        [Route("logbook/{logbookId}")]
        [HttpDelete]
        public ActionResult DeleteLogbookById(long logbookId)
        {
            string jwtToken = RetrieveJwtToken();
            Connection foundUser = _claimsConverter.findUser(jwtToken);

            if(foundUser == null)
            {
                return NotFound();
            }
            Logbook logbook = _logbookRepository.FindByIdAndUser(logbookId, foundUser);

            if(logbook != null)
            {
                _logbookRepository.Delete(logbook);

                return Ok();
            }
            return BadRequest();
        }

        [Route("get/logbook/{logbookId}")]
        [HttpGet]
        public ActionResult GetLogbookById(long logbookId)
        {
            string jwtToken = RetrieveJwtToken();
            return FindLogbookById(jwtToken, logbookId);
        }

        [Route("edit/logbook/{logbookId}")]
        [HttpPut]
        public ActionResult UpdateLogbookById([FromBody] Logbook logbook, long logbookId)
        {
            string jwtToken = RetrieveJwtToken();
            if(_jwtTokenProvider.ValidateToken(jwtToken))
            {
                Connection foundUser = _claimsConverter.findUser(jwtToken);

                if(foundUser == null)
                {
                    return NotFound();
                }
                Logbook foundLogbook = _logbookRepository.FindByIdAndUser(logbookId, foundUser);
                Marker marker = foundLogbook.Marker;

                bool isMarkerUpdating = false;
                if(foundLogbook != null)
                {
                    SetTime(logbook, foundLogbook);
                    foundLogbook.DivingSuit = logbook.DivingSuit;
                    foundLogbook.AirTemperature = logbook.AirTemperature;
                    foundLogbook.AverageDepth = logbook.AverageDepth;
                    foundLogbook.Ballast = logbook.Ballast;
                    foundLogbook.Comment = logbook.Comment;
                    foundLogbook.CylinderCapacity = logbook.CylinderCapacity;
                    foundLogbook.DivingType = logbook.DivingType;
                    foundLogbook.GlovesType = logbook.GlovesType;
                    foundLogbook.MaxDepth = logbook.MaxDepth;
                    foundLogbook.PartnerName = logbook.PartnerName;
                    foundLogbook.PartnerSurname = logbook.PartnerSurname;
                    foundLogbook.Visibility = logbook.Visibility;
                    foundLogbook.WaterEntryType = logbook.WaterEntryType;
                    foundLogbook.WaterTemperature = logbook.WaterTemperature;
                    foundLogbook.WaterType = logbook.WaterType;

                    if(marker != null)
                    {
                        isMarkerUpdating = true;
                    }

                    if(logbook.Marker != null && marker != null)
                    {
                        marker.Name = logbook.Marker.Name;
                        marker.Latitude = logbook.Marker.Latitude;
                        marker.Longitude = logbook.Marker.Longitude;
                    }
                    
                    foundLogbook.Marker = marker;

                    if(isMarkerUpdating)
                    {
                        _markerRepository.Update(marker);
                    } 
                    else
                    {
                        _markerRepository.Save(marker);
                    }
                    _logbookRepository.Update(foundLogbook);
                    return Ok();
                }
            }
            return BadRequest();
        }

        [Route("pdf/logbook/{logbookId}")]
        [HttpGet]
        public ActionResult GetPdfFromLogbookById(long logbookId)
        {
            string jwtToken = RetrieveJwtToken();
            return FindLogbookById(jwtToken, logbookId);
        }

        private void SetTime(Logbook logbook, Logbook foundLogbook)
        {
            DateTime entryTime = logbook.EntryTime;
            long time = (long)(entryTime - new DateTime(1970, 1, 1)).TotalMilliseconds;
            //time = time - 7200000;
            foundLogbook.EntryTime = new DateTime(1970, 1, 1).AddMilliseconds(double.Parse(time.ToString()));

            DateTime exitTime = logbook.ExitTime;
            long time2 = (long)(exitTime - new DateTime(1970, 1, 1)).TotalMilliseconds;
            //time2 = time2 - 7200000;
            foundLogbook.ExitTime = new DateTime(1970, 1, 1).AddMilliseconds(double.Parse(time2.ToString()));
        }

        private string RetrieveJwtToken()
        {
            StringValues jwtToken;
            HttpContext.Request.Headers.TryGetValue("Authorization", out jwtToken);
            return jwtToken.ToString();
        }

        private ActionResult FindLogbookById(string jwtToken, long logbookId)
        {
            Connection foundUser = _claimsConverter.findUser(jwtToken);

            if(foundUser == null)
            {
                return NotFound();
            }
            Logbook logbook = _logbookRepository.FindByIdAndUser(logbookId, foundUser);

            if(logbook != null)
            {
                return Json(logbook);
            }
            return BadRequest();
        }

        private Logbook convertDtoToLogbook(LogbookDto logbookDto)
        {
            Logbook logbook = new Logbook();

            logbook.PartnerName = logbookDto.PartnerName;
            logbook.PartnerSurname = logbookDto.PartnerSurname;
            logbook.Marker = logbookDto.Marker;
            logbook.EntryTime = logbookDto.EntryTime;
            logbook.ExitTime = logbookDto.ExitTime;
            logbook.AverageDepth = Convert.ToDouble(logbookDto.AverageDepth.Replace(".", ","));
            logbook.MaxDepth = Convert.ToDouble(logbookDto.MaxDepth.Replace(".", ","));
            logbook.Visibility = Convert.ToDouble(logbookDto.Visibility.Replace(".", ","));
            logbook.WaterTemperature = Convert.ToDouble(logbookDto.WaterTemperature.Replace(".", ","));
            logbook.AirTemperature = Convert.ToDouble(logbookDto.AirTemperature.Replace(".", ","));
            logbook.CylinderCapacity = logbookDto.CylinderCapacity;
            logbook.DivingSuit = (DivingSuit)Enum.Parse(typeof(DivingSuit), logbookDto.DivingSuit);
            logbook.WaterType = (WaterType)Enum.Parse(typeof(WaterType), logbookDto.WaterType);
            logbook.WaterEntryType = (WaterEntryType)Enum.Parse(typeof(WaterEntryType), logbookDto.WaterEntryType);
            logbook.Ballast = Convert.ToDouble(logbookDto.Ballast.Replace(".", ","));
            logbook.GlovesType = (GloveType)Enum.Parse(typeof(GloveType), logbookDto.GlovesType);
            logbook.DivingType = (DivingType)Enum.Parse(typeof(DivingType), logbookDto.DivingType);
            logbook.Comment = logbookDto.Comment;

            return logbook;
             
        }
    }
}