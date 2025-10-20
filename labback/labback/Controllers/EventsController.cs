// Controllers/EventsController.cs
using labback.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace labback.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly LibriContext _LibriContext;
        private readonly ILogger<EventsController> _logger;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly string _jwtKey;

        public EventsController(LibriContext LibriContext, ILogger<EventsController> logger, IWebHostEnvironment hostingEnvironment, IConfiguration configuration)
        {
            _LibriContext = LibriContext;
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
            _jwtKey = configuration.GetValue<string>("JwtSettings:Key");
        }

       
        // GET: api/Events
        [HttpGet]
        public async Task<IActionResult> GetEvents()
        {
            try
            {
                var events = await _LibriContext.Events
                    .Include(e => e.EventRSVPs)
                        .ThenInclude(rsvp => rsvp.Klient)
                    .ToListAsync();

                var baseUrl = $"{Request.Scheme}://{Request.Host}/foto/";

                var result = events.Select(ev => new
                {
                    ev.EventId,
                    ev.Name,
                    ev.Description,
                    ev.EventDate,
                    ImagePath = !string.IsNullOrEmpty(ev.ImagePath) ? $"{baseUrl}{ev.ImagePath}" : null,
                    EventRSVPs = ev.EventRSVPs.Select(rsvp => new
                    {
                        rsvp.EventRSVPId,
                        rsvp.KlientId,
                        rsvp.EventId,
                        Klient = new
                        {
                            rsvp.Klient.ID,
                            rsvp.Klient.Emri,
                            rsvp.Klient.Mbiemri,
                            rsvp.Klient.Email
                        }
                    }).ToList()
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching events.");
                return StatusCode(500, "Internal server error");
            }
        }


        // GET: api/Events/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEvent(int id)
        {
            try
            {
                var ev = await _LibriContext.Events
                    .Include(e => e.EventRSVPs)
                        .ThenInclude(rsvp => rsvp.Klient)
                    .FirstOrDefaultAsync(e => e.EventId == id);

                if (ev == null)
                {
                    return NotFound();
                }

                var baseUrl = $"{Request.Scheme}://{Request.Host}/foto/";
                if (!string.IsNullOrEmpty(ev.ImagePath))
                {
                    ev.ImagePath = $"{baseUrl}{ev.ImagePath}";
                }

                return Ok(ev);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching event with ID {id}.");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/Events
        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromForm] EventCreateModel model)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid event creation attempt.");
                return BadRequest(ModelState);
            }

            try
            {
                string uniqueFileName = null;

                if (model.Image != null && model.Image.Length > 0)
                {

                    string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "foto");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(model.Image.FileName);
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.Image.CopyToAsync(fileStream);
                    }
                }

                var newEvent = new Event
                {
                    Name = model.Name,
                    Description = model.Description,
                    EventDate = model.EventDate,
                    ImagePath = uniqueFileName
                };

                _LibriContext.Events.Add(newEvent);
                await _LibriContext.SaveChangesAsync();

                _logger.LogInformation($"Event '{newEvent.Name}' created by user ID {GetUserId()}.");

                var baseUrl = $"{Request.Scheme}://{Request.Host}/foto/";
                newEvent.ImagePath = !string.IsNullOrEmpty(newEvent.ImagePath)
                    ? $"{baseUrl}{newEvent.ImagePath}"
                    : null;

                
                return CreatedAtAction(nameof(GetEvent), new { id = newEvent.EventId }, newEvent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating event.");
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, [FromForm] EventUpdateModel model)
        {
            Console.WriteLine($"DEBUG: Received Model - Name={model.Name}, Date={model.EventDate}, Image={model.Image?.FileName}, ImagePath={model.ImagePath}");
            Console.WriteLine($"DEBUG: ModelState is valid? {ModelState.IsValid}");
            foreach (var state in ModelState)
            {
                Console.WriteLine($"DEBUG: Key={state.Key}, Errors={string.Join(", ", state.Value.Errors.Select(e => e.ErrorMessage))}");
            }

            ModelState.Remove(nameof(model.Image));

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var ev = await _LibriContext.Events.FindAsync(id);
            if (ev == null) return NotFound(new { Message = $"Event with ID {id} not found." });

            ev.Name = model.Name;
            ev.Description = model.Description;
            if (model.EventDate.HasValue) ev.EventDate = model.EventDate.Value;

            if (model.Image != null && model.Image.Length > 0)
            {
                string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "foto");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                if (!string.IsNullOrEmpty(ev.ImagePath))
                {
                    var oldFilePath = Path.Combine(uploadsFolder, Path.GetFileName(ev.ImagePath));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                string uniqueFileName = Guid.NewGuid() + "_" + Path.GetFileName(model.Image.FileName);
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await model.Image.CopyToAsync(fileStream);
                }

                ev.ImagePath = uniqueFileName;
            }
            else if (!string.IsNullOrEmpty(model.ImagePath))
            {
                
                ev.ImagePath = Path.GetFileName(model.ImagePath);
            }
            else
            {
              
                return BadRequest(new { Message = "Either an Image or an existing ImagePath must be provided." });
            }

            _LibriContext.Entry(ev).State = EntityState.Modified;
            await _LibriContext.SaveChangesAsync();

            return NoContent();
        }



        // DELETE: api/Events/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            try
            {
                var ev = await _LibriContext.Events.FindAsync(id);
                if (ev == null)
                {
                    return NotFound();
                }

                if (!string.IsNullOrEmpty(ev.ImagePath))
                {
                    string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "foto");
                    var filePath = Path.Combine(uploadsFolder, Path.GetFileName(ev.ImagePath));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _LibriContext.Events.Remove(ev);
                await _LibriContext.SaveChangesAsync();

                _logger.LogInformation($"Event '{ev.Name}' deleted by user ID {GetUserId()}.");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting event ID {id}.");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/Events/5/rsvp
        [HttpPost("{id}/rsvp")]
        public async Task<IActionResult> RSVPToEvent(int id)
        {
            try
            {
                var ev = await _LibriContext.Events
                    .Include(e => e.EventRSVPs)
                    .FirstOrDefaultAsync(e => e.EventId == id);

                if (ev == null)
                {
                    return NotFound("Event not found.");
                }

                int klientId = GetUserId();
                if (klientId == 0)
                {
                    return Unauthorized("Invalid user.");
                }

           
                bool alreadyRSVPed = ev.EventRSVPs.Any(r => r.KlientId == klientId);
                if (alreadyRSVPed)
                {
                    return BadRequest("You have already RSVP'd to this event.");
                }

                var rsvp = new EventRSVP
                {
                    EventId = id,
                    KlientId = klientId
                };

                _LibriContext.EventRSVPs.Add(rsvp);
                await _LibriContext.SaveChangesAsync();

                _logger.LogInformation($"User ID {klientId} RSVP'd to event ID {id}.");

                return Ok("RSVP successful.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error RSVPing to event ID {id}.");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Events/5/attendees
        [HttpGet("{id}/attendees")]
        public async Task<IActionResult> GetAttendees(int id)
        {
            try
            {
                var ev = await _LibriContext.Events
                    .Include(e => e.EventRSVPs)
                        .ThenInclude(rsvp => rsvp.Klient)
                    .FirstOrDefaultAsync(e => e.EventId == id);

                if (ev == null)
                {
                    return NotFound("Event not found.");
                }

                var attendees = ev.EventRSVPs.Select(rsvp => new
                {
                    rsvp.Klient.ID,
                    rsvp.Klient.Emri,
                    rsvp.Klient.Mbiemri,
                    rsvp.Klient.Email,
                    rsvp.Klient.NrTel
                }).ToList();

                _logger.LogInformation($"Retrieved attendees for event ID {id}.");

                return Ok(attendees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching attendees for event ID {id}.");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Events/my-rsvps
        [HttpGet("my-rsvps")]
        public async Task<IActionResult> GetMyRSVPs()
        {
            try
            {
                int klientId = GetUserId();
                if (klientId == 0)
                {
                    return Unauthorized("Invalid user.");
                }

                var rsvps = await _LibriContext.EventRSVPs
                    .Where(r => r.KlientId == klientId)
                    .Select(r => r.EventId)
                    .ToListAsync();

                return Ok(rsvps);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching RSVPs for user ID {GetUserId()}.");
                return StatusCode(500, "Internal server error");
            }
        }

  
        private bool EventExists(int id)
        {
            return _LibriContext.Events.Any(e => e.EventId == id);
        }

        private int GetUserId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "KlientID");
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int klientId))
            {
                return klientId;
            }
            return 0;
        }
    }
}
