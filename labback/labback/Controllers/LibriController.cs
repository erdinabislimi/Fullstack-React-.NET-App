using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using labback.Models;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace labback.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibriController : Controller
    {
        private readonly LibriContext _libriContext;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ILogger<LibriController> _logger;

        private readonly Func<string, int, Notification> _createNotification;

        public LibriController(LibriContext libriContext, IWebHostEnvironment hostingEnvironment, ILogger<LibriController> logger)
        {
            _libriContext = libriContext;
            _hostingEnvironment = hostingEnvironment;
            _logger = logger;

          
            _createNotification = CreateNotification;
        }

     
        private Notification CreateNotification(string message, int klientId)
        {
            _logger.LogInformation("Creating notification for Klient ID: {KlientId} with message: {Message}", klientId, message);
            return new Notification
            {
                message = message,
                isRead = false,
                klientId = klientId,
                exchangeId = null,
                notificationTime = DateTime.Now
            };
        }

        [HttpGet]
        public async Task<IActionResult> GetLibrat()
        {
            var librat = await _libriContext.Librat
                .Include(l => l.zhanri)
                .Include(l => l.AutoriLibris)
                    .ThenInclude(al => al.Autoret)
                .Select(l => new
                {
                    l.ID,
                    l.Isbn,
                    l.Titulli,
                    l.VitiPublikimit,
                    l.NrFaqeve,
                    l.NrKopjeve,
                    l.Gjuha,
                    l.InStock,
                    l.Description,
                    l.ProfilePicturePath,
                    ProfilePictureUrl = $"{Request.Scheme}://{Request.Host}/foto/{l.ProfilePicturePath}",
                    l.ShtepiaBotueseID,
                    Zhanri = l.zhanri != null ? new
                    {
                        l.zhanri.zhanriId,
                        l.zhanri.emri
                    } : null,
                    Autoret = l.AutoriLibris.Select(al => new
                    {
                        al.Autoret.Autori_ID,
                        al.Autoret.Emri,
                        al.Autoret.Mbiemri,
                        al.Autoret.nofka,
                        al.Autoret.gjinia,
                        al.Autoret.Data_E_Lindjes,
                        al.Autoret.Nacionaliteti
                    }).ToList()
                })
                .ToListAsync();

            return Ok(librat);
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestBooks()
        {
            try
            {
                var latestBooks = await _libriContext.Librat
                    .Include(l => l.zhanri)
                    .Include(l => l.AutoriLibris)
                        .ThenInclude(al => al.Autoret)
                    .OrderByDescending(l => l.ID) 
                    .Take(3)
                    .Select(l => new
                    {
                        l.ID,
                        l.Isbn,
                        l.Titulli,
                        l.VitiPublikimit,
                        l.NrFaqeve,
                        l.NrKopjeve,
                        l.Gjuha,
                        l.InStock,
                        l.Description,
                        l.ProfilePicturePath,
                        ProfilePictureUrl = $"{Request.Scheme}://{Request.Host}/foto/{l.ProfilePicturePath}",
                        l.ShtepiaBotueseID,
                        Zhanri = l.zhanri != null ? new
                        {
                            l.zhanri.zhanriId,
                            l.zhanri.emri
                        } : null,
                        Autoret = l.AutoriLibris.Select(al => new
                        {
                            al.Autoret.Autori_ID,
                            al.Autoret.Emri,
                            al.Autoret.Mbiemri,
                            al.Autoret.nofka,
                            al.Autoret.gjinia,
                            al.Autoret.Data_E_Lindjes,
                            al.Autoret.Nacionaliteti
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(latestBooks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching the latest books.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLibri(int id)
        {
            _logger.LogInformation("Fetching book with ID: {ID}", id);

            try
            {
                var libri = await _libriContext.Librat
                    .Include(l => l.zhanri)
                    .Include(l => l.RatingComments)
                        .ThenInclude(rc => rc.Klient)
                    .FirstOrDefaultAsync(l => l.ID == id);

                if (libri == null)
                {
                    _logger.LogWarning("Book with ID: {ID} not found", id);
                    return NotFound();
                }

                var baseUrl = $"{Request.Scheme}://{Request.Host}/foto";
                libri.ProfilePictureUrl = $"{baseUrl}/{libri.ProfilePicturePath}";

                return Ok(libri);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching book with ID: {ID}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Libri>> PostLibri([FromForm] LibriDTO model, IFormFile profilePicture)
        {
            if (ModelState.IsValid)
            {
                if (profilePicture != null && profilePicture.Length > 0)
                {
                    string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "foto");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }
                    string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(profilePicture.FileName);
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await profilePicture.CopyToAsync(fileStream);
                    }
                    var libri = new Libri
                    {
                        Isbn = model.Isbn,
                        Titulli = model.Titulli,
                        VitiPublikimit = model.VitiPublikimit,
                        NrFaqeve = model.NrFaqeve,
                        NrKopjeve = model.NrKopjeve,
                        Gjuha = model.Gjuha,
                        InStock = model.InStock,
                        Description = model.Description,
                        ProfilePicturePath = uniqueFileName,
                        ShtepiaBotueseID = model.ShtepiaBotueseID,
                        zhanriId = model.zhanriId
                    };
                    _libriContext.Librat.Add(libri);
                    await _libriContext.SaveChangesAsync();    
                    var userIds = await _libriContext.Klients
                        .Where(k => k.RoliID == 1) 
                        .AsNoTracking() 
                        .Select(k => k.ID)
                        .ToListAsync();
                    if (userIds.Any())
                    {
                        var notifications = userIds.Select(id => _createNotification($"U shtua një libër i ri në bibliotekë: {libri.Titulli}", id)).ToList();

                        _libriContext.Notifications.AddRange(notifications);
                        await _libriContext.SaveChangesAsync();
                    }
                    return CreatedAtAction(nameof(GetLibri), new { id = libri.ID }, libri);
                }
                else
                {
                    ModelState.AddModelError("ProfilePicture", "Profile picture is required.");
                    return BadRequest(ModelState);
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutLibri(int id, [FromForm] LibriDTO model, IFormFile? profilePicture, [FromForm] string? profilePicturePath)
        {
            try
            {
                var libri = await _libriContext.Librat.FindAsync(id);
                if (libri == null)
                {
                    return NotFound("Book not found.");
                }

                if (ModelState.IsValid)
                {
                    libri.Isbn = model.Isbn;
                    libri.Titulli = model.Titulli;
                    libri.VitiPublikimit = model.VitiPublikimit;
                    libri.NrFaqeve = model.NrFaqeve;
                    libri.NrKopjeve = model.NrKopjeve;
                    libri.Gjuha = model.Gjuha;
                    libri.InStock = model.InStock;
                    libri.Description = model.Description;
                    libri.ShtepiaBotueseID = model.ShtepiaBotueseID;
                    libri.zhanriId = model.zhanriId;

                    if (profilePicture != null && profilePicture.Length > 0)
                    {
                        string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "foto");
                        if (!Directory.Exists(uploadsFolder))
                        {
                            Directory.CreateDirectory(uploadsFolder);
                        }

                        if (!string.IsNullOrEmpty(libri.ProfilePicturePath))
                        {
                            var oldFilePath = Path.Combine(uploadsFolder, libri.ProfilePicturePath);
                            if (System.IO.File.Exists(oldFilePath))
                            {
                                System.IO.File.Delete(oldFilePath);
                            }
                        }

                        string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(profilePicture.FileName);
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await profilePicture.CopyToAsync(fileStream);
                        }

                        libri.ProfilePicturePath = uniqueFileName;
                    }
                    else if (!string.IsNullOrEmpty(profilePicturePath))
                    {
                        libri.ProfilePicturePath = profilePicturePath;
                    }
                    else
                    {
                        return BadRequest(new { profilePicture = "The profilePicture field is required." });
                    }

                    _libriContext.Entry(libri).State = EntityState.Modified;
                    await _libriContext.SaveChangesAsync();

                    return NoContent();
                }

                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating the book record.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLibri(int id)
        {
            var libri = await _libriContext.Librat.FindAsync(id);
            if (libri == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(libri.ProfilePicturePath))
            {
                string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "foto");
                var filePath = Path.Combine(uploadsFolder, libri.ProfilePicturePath);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _libriContext.Librat.Remove(libri);
            await _libriContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("count")]
        public IActionResult GetBookCount()
        {
            try
            {
                var bookCount = _libriContext.Librat.Count();
                return Ok(new { count = bookCount });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while counting the books.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPatch("rating-comment/{id}")]
        public async Task<IActionResult> PatchRatingComment(int id, [FromBody] PartialUpdateRatingCommentModel model)
        {
            var ratingComment = await _libriContext.RatingComments.FindAsync(id);
            if (ratingComment == null)
            {
                return NotFound();
            }

            if (model.Rating.HasValue)
            {
                ratingComment.Rating = model.Rating.Value;
            }

            if (!string.IsNullOrEmpty(model.Comment))
            {
                ratingComment.Comment = model.Comment;
            }

            _libriContext.Entry(ratingComment).State = EntityState.Modified;
            await _libriContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("getAutoret/{id}")]
        public async Task<IActionResult> getAutoretPrejLibrit(int id)
        {
            var libri = await _libriContext.Librat
                .Include(l => l.AutoriLibris)
                .ThenInclude(al => al.Autoret)
                .FirstOrDefaultAsync(l => l.ID == id);

            if (libri == null) return NotFound();

            var autori = libri.AutoriLibris.Select(al => new
            {
                AutoriLibriID = al.ID,
                Autori_ID = al.Autoret.Autori_ID,
                al.Autoret.Emri,
                al.Autoret.Mbiemri,
                al.Autoret.nofka,
                al.Autoret.gjinia,
                al.Autoret.Data_E_Lindjes,
                al.Autoret.Nacionaliteti
            }).ToList();

            return Ok(autori);
        }

        [HttpPost("{id}/ShtoAutorin/{autori_ID}")]
        public async Task<IActionResult> AddAuthorToBook(int id, int autori_ID)
        {
            if (autori_ID <= 0)
            {
                return BadRequest("Invalid author ID.");
            }

            var book = await _libriContext.Librat.FindAsync(id);
            if (book == null)
                return NotFound("Book not found.");

            var author = await _libriContext.Autori.FindAsync(autori_ID);
            if (author == null)
                return NotFound("Author not found.");

            var autoriLibri = new AutoriLibri
            {
                ID = id,
                Autori_ID = autori_ID
            };

            _libriContext.AutoriLibris.Add(autoriLibri);
            await _libriContext.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}/delete/{autori_ID}")]
        public async Task<ActionResult> RemoveAuthorFromBook(int id, int autori_ID)
        {
            var autoriLibri = await _libriContext.AutoriLibris
                .FirstOrDefaultAsync(al => al.ID == id && al.Autori_ID == autori_ID);

            if (autoriLibri == null)
                return NotFound("Relationship not found.");

            _libriContext.AutoriLibris.Remove(autoriLibri);
            await _libriContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id}/UpdateAuthors")]
        public async Task<IActionResult> UpdateAuthorsOfBook(int id, [FromBody] List<int> authorIds)
        {
            try
            {
                var book = await _libriContext.Librat
                    .Include(b => b.AutoriLibris)
                    .FirstOrDefaultAsync(b => b.ID == id);

                if (book == null) return NotFound("Book not found.");

                var currentAuthorIds = book.AutoriLibris.Select(al => al.Autori_ID).ToList();

                var authorsToAdd = authorIds.Except(currentAuthorIds).ToList();
                foreach (var authorId in authorsToAdd)
                {
                    var author = await _libriContext.Autori.FindAsync(authorId);
                    if (author != null)
                    {
                        book.AutoriLibris.Add(new AutoriLibri
                        {
                            Autori_ID = authorId,
                            ID = book.ID
                        });
                    }
                }

                var authorsToRemove = currentAuthorIds.Except(authorIds).ToList();
                var relationsToRemove = book.AutoriLibris
                    .Where(al => authorsToRemove.Contains(al.Autori_ID))
                    .ToList();
                _libriContext.AutoriLibris.RemoveRange(relationsToRemove);

                await _libriContext.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating authors.");
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
