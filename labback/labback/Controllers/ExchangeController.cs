using labback.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace labback.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExchangeController : ControllerBase
    {
        private readonly LibriContext _context;

        public ExchangeController(LibriContext context)
        {
            _context = context;
        }

        // GET: api/Exchange
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetExchanges()
        {
            var exchanges = await _context.Exchanges
                .Include(e => e.Klient)
                .Include(e => e.Libri)
                .ToListAsync();

            foreach (var exchange in exchanges)
            {
                if (exchange.ReturnDate < DateTime.Now && exchange.Status != "Ended")
                {
                    var notifications = _context.Notifications.Where(n => n.exchangeId == exchange.ExchangeId);
                    _context.Notifications.RemoveRange(notifications);
                    _context.Exchanges.Remove(exchange);
                }
                else if (exchange.Status == "Approved")
                {
                    var libri = exchange.Libri;
                    var approvedExchangesCount = await _context.Exchanges
                        .CountAsync(e => e.LibriId == libri.ID && e.Status == "Approved");

                    if (approvedExchangesCount >= libri.NrKopjeve)
                    {
                        libri.InStock = 0;
                    }
                    else
                    {
                        libri.InStock = 1;
                    }

                    _context.Entry(libri).State = EntityState.Modified;
                }
            }

            await _context.SaveChangesAsync();

            var exchangeDTOs = exchanges
                .OrderByDescending(e => e.ReturnDate) 
                .ThenBy(e => e.Status == "Not Returned Yet" ? 1 : (e.Status == "Ended" ? 2 : 3))  
                .Select(e => new
                {
                    e.ExchangeId,
                    Klient = new { e.KlientId, e.Klient.Email, e.Klient.Emri },
                    Libri = new { e.LibriId, e.Libri.Isbn, e.Libri.Titulli },
                    e.Status,
                    e.ExchangeDate,
                    e.ReturnDate
                })
                .ToList();

            return exchangeDTOs;
        }


        [HttpGet("User/{userId}")]
        public async Task<IActionResult> GetUserExchanges(int userId)
        {
            try
            {
                if (userId <= 0)
                {
                    return BadRequest(new { message = "Invalid user ID." });
                }

                var userExchanges = await _context.Exchanges
                    .Include(e => e.Klient)
                    .Include(e => e.Libri)
                    .Where(e => e.KlientId == userId)
                    .ToListAsync();

                if (userExchanges == null || userExchanges.Count == 0)
                {
                    return NotFound(new { message = "No exchanges found for this user." });
                }

                var response = userExchanges.Select(e => new
                {
                    exchangeId = e.ExchangeId,
                    status = e.Status,
                    exchangeDate = e.ExchangeDate,
                    returnDate = e.ReturnDate,
                    isApproved = e.IsApproved,
                    notifications = e.Notifications,
                    klientId = e.KlientId,
                    klientEmri = e.Klient.Emri,
                    libriId = e.LibriId,
                    libri = new
                    {
                        id = e.Libri.ID,
                        isbn = e.Libri.Isbn,
                        titulli = e.Libri.Titulli,
                        vitiPublikimit = e.Libri.VitiPublikimit,
                        nrFaqeve = e.Libri.NrFaqeve,
                        nrKopjeve = e.Libri.NrKopjeve,
                        gjuha = e.Libri.Gjuha,
                        inStock = e.Libri.InStock,
                        description = e.Libri.Description,
                        profilePicturePath = e.Libri.ProfilePicturePath,
                        profilePictureUrl = e.Libri.ProfilePictureUrl,
                        shtepiaBotueseID = e.Libri.ShtepiaBotueseID,
                        shtepiaBotuese = e.Libri.ShtepiaBotuese,
                        zhanriId = e.Libri.zhanriId,
                        zhanri = e.Libri.zhanri,
                        ratingComments = e.Libri.RatingComments,
                        autoriLibris = e.Libri.AutoriLibris
                    }
                });

                return Ok(new { userId = userId, values = response });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching exchanges for user {userId}: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while fetching exchanges." });
            }
        }

        [HttpGet("count")]
        public IActionResult GetExchangeCount()
        {
            try
            {
                var exchangeCount = _context.Exchanges.Count();
                return Ok(new { count = exchangeCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }


        // GET: api/Exchange/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Exchange>> GetExchange(int id)
        {
            var exchange = await _context.Exchanges.FindAsync(id);

            if (exchange == null)
            {
                return NotFound();
            }

            return exchange;
        }
       

        // PUT: api/Exchange/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<Exchange>> UpdateExchange(int id, ExchangeDTO exchangeDTO)
        {
            if (id != exchangeDTO.ExchangeId)
            {
                return BadRequest("Exchange ID mismatch.");
            }

            var exchange = await _context.Exchanges.FindAsync(id);
            if (exchange == null)
            {
                return NotFound();
            }


            var klient = await _context.Klients.FindAsync(exchangeDTO.KlientId);
            if (klient == null)
            {
                return BadRequest("Invalid klient ID.");
            }

            var libri = await _context.Librat.FindAsync(exchangeDTO.LibriId);
            if (libri == null)
            {
                return BadRequest("Invalid Libri ID.");
            }

            exchange.KlientId = klient.ID;
            exchange.LibriId = libri.ID;
            exchange.Status = exchangeDTO.Status;
            exchange.ExchangeDate = exchangeDTO.ExchangeDate;
            exchange.ReturnDate = exchangeDTO.ReturnDate;

            _context.Entry(exchange).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExchangeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool ExchangeExists(int id)
        {
            return _context.Exchanges.Any(e => e.ExchangeId == id);
        }

        [HttpPut("Delete/{id}")]
        public async Task<IActionResult> DeleteExchange(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var exchange = await _context.Exchanges
                        .Include(e => e.Libri)
                        .FirstOrDefaultAsync(e => e.ExchangeId == id);

                    if (exchange == null)
                    {
                        return NotFound(new { message = "Exchange not found." });
                    }

                    if (exchange.Status != "Pending Approval")
                    {
                        return BadRequest(new { message = "Exchange is not in a pending state." });
                    }

                    if (exchange.Libri == null)
                    {
                        return BadRequest(new { message = "Libri not found for the exchange." });
                    }

                    _context.Exchanges.Remove(exchange);

                    var relatedNotifications = await _context.Notifications
                        .Where(n => n.exchangeId == exchange.ExchangeId)
                        .ToListAsync();

                    _context.Notifications.RemoveRange(relatedNotifications);

                    var deleteNotification = new Notification
                    {
                        message = $"Your exchange request for Libri {exchange.Libri.Titulli} has been not approved.",
                        isRead = false,
                        klientId = exchange.KlientId,
                        exchangeId = exchange.ExchangeId,
                        notificationTime = DateTime.Now
                    };

                    _context.Notifications.Add(deleteNotification);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    return Ok(new { message = "Exchange deleted and user notified." });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();

                    Console.WriteLine($"Error deleting exchange: {ex.InnerException?.Message ?? ex.Message}");
                    return StatusCode(500, new { error = $"Error deleting exchange: {ex.InnerException?.Message ?? ex.Message}" });
                }
            }
        }


        [HttpGet("CountByLibri/{libriId}")]
        public async Task<ActionResult<int>> CountExchangesByLibri(int libriId)
        {
            try
            {
                int count = await _context.Exchanges
                    .CountAsync(e => e.LibriId == libriId);

                return Ok(count);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error counting exchanges: {ex.Message}");
            }
        }

        [HttpGet("PendingApprovalLast24To48Hours")]
        public async Task<ActionResult<IEnumerable<object>>> GetPendingApprovalExchangesLast24To48Hours()
        {
            try
            {
               
                var startTime = DateTime.Now.AddHours(-48);
                var endTime = DateTime.Now.AddHours(-24);

                var exchanges = await _context.Exchanges
                    .Where(e => e.ExchangeDate >= startTime && e.ExchangeDate <= endTime && !e.IsApproved)
                    .OrderByDescending(e => e.ReturnDate) 
                    .ThenBy(e => e.Status == "Not Returned Yet" ? 1 : (e.Status == "Ended" ? 2 : 3)) 
                    .Select(e => new
                    {
                        e.ExchangeId,
                        Klient = new { e.KlientId, e.Klient.Email, e.Klient.Emri },
                        Libri = new { e.LibriId, e.Libri.Isbn, e.Libri.Titulli },
                        e.Status,
                        e.ExchangeDate,
                        e.ReturnDate
                    })
                    .ToListAsync();

                return Ok(exchanges);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving exchanges: {ex.Message}");
            }
        }


        // GET: api/Exchange/User/{userId}
      
        [HttpPut("Approve/{id}")]
        public async Task<IActionResult> ApproveExchange(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var exchange = await _context.Exchanges
                        .Include(e => e.Libri)
                        .FirstOrDefaultAsync(e => e.ExchangeId == id);

                    if (exchange == null)
                    {
                        return NotFound(new { message = "Exchange not found." });
                    }

                    if (exchange.Status != "Pending Approval")
                    {
                        return BadRequest(new { message = "Exchange is not in a pending state." });
                    }

                    if (exchange.Libri == null)
                    {
                        return BadRequest(new { message = "Libri not found for the exchange." });
                    }

                    exchange.Status = "Approved";
                    _context.Entry(exchange).State = EntityState.Modified;

                    var otherRequests = await _context.Exchanges
                        .Where(e => e.KlientId == exchange.KlientId && e.Status == "Pending Approval" && e.ExchangeId != id)
                        .ToListAsync();

                    foreach (var request in otherRequests)
                    {
                        var relatedNotifications = await _context.Notifications
                            .Where(n => n.exchangeId == request.ExchangeId)
                            .ToListAsync();

                        _context.Notifications.RemoveRange(relatedNotifications);
                        _context.Exchanges.Remove(request);
                    }

                    await _context.SaveChangesAsync();

                    var pendingApprovalNotifications = await _context.Notifications
                        .Where(n => n.exchangeId == exchange.ExchangeId && n.message.Contains("is pending approval"))
                        .ToListAsync();

                    _context.Notifications.RemoveRange(pendingApprovalNotifications);

                    var approvalNotification = new Notification
                    {
                        message = $"Your exchange for Libri {exchange.Libri.Titulli} has been approved,please return your book within 7 days.",
                        isRead = false,
                        klientId = exchange.KlientId,
                        exchangeId = exchange.ExchangeId,
                        notificationTime = DateTime.Now
                    };

                    _context.Notifications.Add(approvalNotification);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    return Ok(new { message = "Exchange approved, notification sent, and other pending requests canceled." });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();

                    Console.WriteLine($"Error approving exchange: {ex.InnerException?.Message ?? ex.Message}");
                    return StatusCode(500, new { error = $"Error approving exchange: {ex.InnerException?.Message ?? ex.Message}" });
                }
            }
        }
        [HttpGet("Notifications/Unread")]
        public async Task<IActionResult> GetUnreadNotifications(int clientId)
        {
            try
            {
                var unreadNotifications = await _context.Notifications
                    .Where(n => n.klientId == clientId && !n.isRead)
                    .OrderByDescending(n => n.notificationTime)
                    .ToListAsync();

                return Ok(unreadNotifications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching unread notifications: {ex.Message}");
            }
        }


        [HttpPut("Notifications/MarkAllAsRead")]
        public async Task<IActionResult> MarkAllNotificationsAsRead(int clientId)
        {
            try
            {
                var unreadNotifications = await _context.Notifications
                    .Where(n => n.klientId == clientId && !n.isRead)
                    .ToListAsync();

                foreach (var notification in unreadNotifications)
                {
                    notification.isRead = true;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "All notifications marked as read." });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Database update error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error marking notifications as read: {ex.Message}");
            }
        }





        // PUT: api/Exchange/EndExchange/{id}]
        [HttpPut("EndExchange/{id}")]
        public async Task<IActionResult> EndExchange(int id)
        {
            try
            {
                var exchange = await _context.Exchanges.FindAsync(id);

                if (exchange == null)
                {
                    return NotFound();
                }

                exchange.Status = "Ended";
                _context.Entry(exchange).State = EntityState.Modified;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error ending exchange: {ex.Message}");
            }
        }

        [HttpGet("ExpiringInThreeDays/{klientId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetExchangesExpiringInThreeDays(int klientId)
        {
            try
            {
                var now = DateTime.Now;
                var threeDaysFromNow = now.AddDays(3);

                var exchanges = await _context.Exchanges
                    .Include(e => e.Klient)
                    .Include(e => e.Libri)
                    .Where(e => e.Status == "Approved" && e.KlientId == klientId && e.ReturnDate <= threeDaysFromNow && e.ReturnDate >= now)
                    .Select(e => new
                    {
                        e.ExchangeId,
                        Klient = new { e.KlientId, e.Klient.Email, e.Klient.Emri },
                        Libri = new { e.LibriId, e.Libri.Isbn, e.Libri.Titulli },
                        e.Status,
                        e.ExchangeDate,
                        e.ReturnDate
                    })
                    .ToListAsync();

                foreach (var exchange in exchanges)
                {
                    var message = $"Dear {exchange.Klient.Emri}, your exchange period for the book '{exchange.Libri.Titulli}' expires in three days. Please return the book before the return date.";

                    var notification = new Notification
                    {
                        message = message,
                        isRead = false,
                        klientId = exchange.Klient.KlientId,
                        exchangeId = exchange.ExchangeId,
                        notificationTime = DateTime.Now
                    };

                    _context.Notifications.Add(notification);
                }

                await _context.SaveChangesAsync();

                return Ok(exchanges);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving exchanges: {ex.Message}");
            }
        }
        // POST: api/Exchange
        [HttpPost]
        public async Task<ActionResult<Exchange>> PostExchange(ExchangeDTO exchangeDTO)
        {
            try
            {
                var klient = await _context.Klients.FirstOrDefaultAsync(k => k.NrPersonal == exchangeDTO.NrPersonal);
                if (klient == null)
                {
                    return BadRequest("Invalid nrPersonal.");
                }

                var hasValidPayment = await _context.Payments
                    .AnyAsync(p => p.KlientId == klient.ID && p.PaymentStatus == "Completed" && p.ValidUntil >= DateTime.UtcNow);
                if (!hasValidPayment)
                {
                    return BadRequest("You cannot request an exchange until you have paid your yearly membership fee.");
                }

                var hasOngoingExchange = await _context.Exchanges
                    .AnyAsync(e => e.KlientId == klient.ID && e.Status == "Approved");
                if (hasOngoingExchange)
                {
                    return BadRequest("You cannot make a new exchange request while you already have an ongoing exchange.");
                }

                var duplicateRequestForBook = await _context.Exchanges
                    .AnyAsync(e => e.KlientId == klient.ID && e.LibriId == exchangeDTO.LibriId && e.Status != "Rejected");
                if (duplicateRequestForBook)
                {
                    return BadRequest("You cannot request an exchange for the same book twice.");
                }

                var libri = await _context.Librat.FindAsync(exchangeDTO.LibriId);
                if (libri == null)
                {
                    return BadRequest("Invalid Libri ID.");
                }

                var exchange = new Exchange
                {
                    KlientId = klient.ID,
                    LibriId = libri.ID,
                    Status = "Pending Approval",
                    ExchangeDate = DateTime.UtcNow,
                    ReturnDate = DateTime.UtcNow.AddDays(7),
                    IsApproved = false
                };

                _context.Exchanges.Add(exchange);
                await _context.SaveChangesAsync();

                var userNotification = new Notification
                {
                    message = $"Your exchange request for '{libri.Titulli}' is pending approval.",
                    isRead = false,
                    klientId = klient.ID,  
                    exchangeId = exchange.ExchangeId,
                    notificationTime = DateTime.UtcNow
                };
                _context.Notifications.Add(userNotification);

                var admins = await _context.Klients
                    .Where(k => k.RoliID == 2)
                    .ToListAsync();
                foreach (var admin in admins)
                {
                    var adminNotification = new Notification
                    {
                        message = $"New exchange request from {klient.Emri} for the book '{libri.Titulli}'",
                        isRead = false,
                        klientId = admin.ID,      
                        exchangeId = exchange.ExchangeId,
                        notificationTime = DateTime.UtcNow
                    };
                    _context.Notifications.Add(adminNotification);
                }

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetExchange), new { id = exchange.ExchangeId }, exchange);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating exchange: {ex.Message}");
            }
        }


        [HttpGet("TopExchangedBooks")]
        public async Task<ActionResult<IEnumerable<object>>> GetTopExchangedBooks()
        {
            try
            {
                var topBooks = await _context.Exchanges
                    .Where(e => e.Status == "Approved") 
                    .GroupBy(e => e.LibriId)
                    .Select(group => new
                    {
                        LibriId = group.Key,
                        ExchangeCount = group.Count()
                    })
                    .OrderByDescending(g => g.ExchangeCount)
                    .Take(3)
                    .ToListAsync();

                if (topBooks.Count == 0)
                {
                    return Ok(new List<object>());
                }

               
                var bookIds = topBooks.Select(t => t.LibriId).ToList();
                var books = await _context.Librat
                    .Where(l => bookIds.Contains(l.ID))
                    .Include(l => l.zhanri)  
                    .ToListAsync();

               
                var result = books.Select(l => new
                {
                    l.ID,
                    l.Titulli,
                    l.Isbn,
                    l.AutoriLibris,
                    l.NrFaqeve,
                    l.Description,
                    ProfilePicturePath = l.ProfilePicturePath ?? "defaultProfilePic.jpg",  
                    ProfilePictureUrl = l.ProfilePictureUrl ?? "defaultProfilePic.jpg",  
                    Zhanri = l.zhanri?.emri ?? "Unknown", 
                    ExchangeCount = topBooks.First(t => t.LibriId == l.ID).ExchangeCount
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving top exchanged books: {ex.Message}");
            }
        }



    }
}