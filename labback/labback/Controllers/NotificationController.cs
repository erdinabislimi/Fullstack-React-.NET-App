using labback.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace labback.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly LibriContext _context;
        private readonly ILogger<NotificationController> _logger;

       
        private readonly Func<Notification, NotificationDTO> _convertToDto;

        public NotificationController(LibriContext context, ILogger<NotificationController> logger)
        {
            _context = context;
            _logger = logger;

           
            _convertToDto = ConvertToDto;
        }

        
        private NotificationDTO ConvertToDto(Notification notification)
        {
            _logger.LogInformation("Converting Notification ID: {NotificationId} to DTO.", notification.notificationId);
            return new NotificationDTO
            {
                notificationId = notification.notificationId,
                message = notification.message,
                isRead = notification.isRead,
                klientId = notification.klientId,
                exchangeId = notification.exchangeId,
                notificationTime = notification.notificationTime,
                titulli = (notification.exchange != null && notification.exchange.Libri != null)
                            ? notification.exchange.Libri.Titulli
                            : "N/A"
            };
        }

      
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetNotifications()
        {
            try
            {
                var notifications = await _context.Notifications
                    .Include(n => n.exchange)
                        .ThenInclude(e => e.Libri)
                    .ToListAsync();

                var notificationDTOs = notifications.Select(n => _convertToDto(n)).ToList();

                return Ok(notificationDTOs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving notifications.");
                return StatusCode(500, "An error occurred while retrieving notifications.");
            }
        }

        // GET: api/Notification/klient
        [HttpGet("klient")]
        [Authorize]
        public async Task<IActionResult> GetNotificationsKlient()
        {
            try
            {
                var klientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (klientIdClaim == null)
                {
                    _logger.LogWarning("Klient ID not found in the token.");
                    return Unauthorized("Invalid token, klient ID not found.");
                }

                if (!int.TryParse(klientIdClaim.Value, out int klientId))
                {
                    _logger.LogWarning("Invalid klient ID format in the token.");
                    return Unauthorized("Invalid klient ID format.");
                }

                var notifications = await _context.Notifications
                    .Where(n => n.klientId == klientId || n.klientId == null)
                    .Include(n => n.exchange)
                        .ThenInclude(e => e.Libri)
                    .ToListAsync();

                var notificationDTOs = notifications.Select(n => _convertToDto(n)).ToList();

                return Ok(notificationDTOs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving notifications for klient.");
                return StatusCode(500, "An error occurred while retrieving notifications.");
            }
        }

        [HttpPatch("markAllAsRead")]
        public async Task<IActionResult> MarkAllAsRead([FromQuery] int klientId)
        {
            try
            {
                _logger.LogInformation($"Marking all notifications as read for klientId: {klientId}");

                if (klientId <= 0)
                {
                    _logger.LogWarning($"Invalid klientId received: {klientId}");
                    return BadRequest("Invalid klient ID.");
                }

                var unreadNotifications = await _context.Notifications
                    .Where(n => n.klientId == klientId && !n.isRead)
                    .ToListAsync();

                if (!unreadNotifications.Any())
                {
                    _logger.LogInformation("No unread notifications found.");
                    return Ok(new { message = "No unread notifications found." });
                }

                unreadNotifications.ForEach(n => n.isRead = true);

                await _context.SaveChangesAsync();

                _logger.LogInformation("All notifications marked as read.");
                return Ok(new { message = "All notifications marked as read." });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database update error while marking notifications as read.");
                return StatusCode(500, $"Database update error: {ex.Message}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking notifications as read.");
                return StatusCode(500, $"Error marking notifications as read: {ex.Message}");
            }
        }


        // GET: api/Notification/unreadCount
        [HttpGet("unreadCount")]
        [Authorize]
        public async Task<IActionResult> GetUnreadNotificationCount()
        {
            try
            {
                var klientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (klientIdClaim == null)
                {
                    _logger.LogWarning("Klient ID not found in the token.");
                    return Unauthorized("Invalid token, klient ID not found.");
                }

                if (!int.TryParse(klientIdClaim.Value, out int klientId))
                {
                    _logger.LogWarning("Invalid klient ID format in the token.");
                    return Unauthorized("Invalid klient ID format.");
                }

                var unreadCount = await _context.Notifications
                    .Where(n => n.klientId == klientId && !n.isRead)
                    .CountAsync();

                _logger.LogInformation($"Unread notifications count for klientId {klientId}: {unreadCount}");
                return Ok(unreadCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while counting unread notifications.");
                return StatusCode(500, "An error occurred while counting unread notifications.");
            }
        }

        // POST: api/Notification
        [HttpPost]
        public async Task<ActionResult<Notification>> PostNotification(NotificationDTO notificationDTO)
        {
            if (string.IsNullOrWhiteSpace(notificationDTO.message))
            {
                return BadRequest("Notification message cannot be empty.");
            }

            if (notificationDTO.klientId <= 0 && notificationDTO.klientId != null)
            {
                return BadRequest("Invalid klient ID.");
            }

          

            var notification = new Notification
            {
                message = notificationDTO.message,
                isRead = notificationDTO.isRead,
                klientId = notificationDTO.klientId != 0 ? (int?)notificationDTO.klientId : null,
                exchangeId = notificationDTO.exchangeId != 0 ? (int?)notificationDTO.exchangeId : null,
                notificationTime = DateTime.Now
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNotifications), new { id = notification.notificationId }, notification);
        }

        // PUT: api/Notification/approveOrDeleteNotification/5?isApproved=true
        [HttpPut("approveOrDeleteNotification/{notificationId}")]
        [Authorize(Roles = "Admin, Klient")]
        public async Task<IActionResult> ApproveOrDeleteNotification(int notificationId, [FromQuery] bool isApproved)
        {
            try
            {
                var notification = await _context.Notifications
                    .Include(n => n.exchange)
                        .ThenInclude(e => e.Libri)
                    .Include(n => n.klient)
                    .FirstOrDefaultAsync(n => n.notificationId == notificationId);

                if (notification == null)
                {
                    return NotFound("Notification not found.");
                }

                if (isApproved)
                {
                    notification.isRead = true;
                    await _context.SaveChangesAsync();

                    var notificationDTO = _convertToDto(notification);
                    notificationDTO.message = $"The request for \"{notificationDTO.message}\" has been approved.";
                    notificationDTO.isRead = true;
                    notificationDTO.notificationTime = DateTime.Now;

                    return Ok(notificationDTO);
                }
                else
                {
                    _context.Notifications.Remove(notification);
                    await _context.SaveChangesAsync();

                    var notificationDTO = _convertToDto(notification);
                    notificationDTO.message = $"The request for \"{notificationDTO.message}\" has been deleted.";
                    notificationDTO.isRead = true;
                    notificationDTO.notificationTime = DateTime.Now;

                    return Ok(notificationDTO);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error approving or deleting notification.");
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }
    }
}
