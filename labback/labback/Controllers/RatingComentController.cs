using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using labback.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace labback.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RatingCommentController : ControllerBase
    {
        private readonly LibriContext _context;

        public RatingCommentController(LibriContext context)
        {
            _context = context;
        }



        // GET: api/RatingComment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RatingCommentDto>> GetRatingComment(int id)
        {
            var ratingComment = await _context.RatingComments
                                              .Include(rc => rc.Klient)
                                              .Include(rc => rc.Libri)
                                              .Select(rc => new RatingCommentDto
                                              {
                                                  RatingsCommentID = rc.RatingsCommentID,
                                                  Rating = rc.Rating,
                                                  Comment = rc.Comment,
                                                  KlientID = rc.KlientID,
                                                  KlientName = rc.Klient.Emri + " " + rc.Klient.Mbiemri,
                                                  LibriID = rc.LibriID,
                                                  LibriTitle = rc.Libri.Titulli
                                              })
                                              .FirstOrDefaultAsync(rc => rc.RatingsCommentID == id);

            if (ratingComment == null)
            {
                return NotFound();
            }

            return ratingComment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RatingCommentDto>>> GetRatingComments()
        {
            var ratingComments = await _context.RatingComments
                                               .Include(rc => rc.Klient)
                                               .Include(rc => rc.Libri)
                                               .Select(rc => new RatingCommentDto
                                               {
                                                   RatingsCommentID = rc.RatingsCommentID,
                                                   Rating = rc.Rating,
                                                   Comment = rc.Comment,
                                                   KlientID = rc.KlientID,
                                                   KlientName = rc.Klient.Emri + " " + rc.Klient.Mbiemri,
                                                   LibriID = rc.LibriID,
                                                   LibriTitle = rc.Libri.Titulli
                                               })
                                               .ToListAsync();

            return ratingComments;
        }

        [HttpPost]
        public async Task<ActionResult<RatingCommentDto>> PostRatingComment(RatingCommentDto ratingCommentDto)
        {
    
            var existingRating = await _context.RatingComments
                                               .FirstOrDefaultAsync(rc => rc.KlientID == ratingCommentDto.KlientID && rc.LibriID == ratingCommentDto.LibriID);

            if (existingRating != null)
            {
                return Conflict(new { message = "The client has already rated this book." });
            }

            if (string.IsNullOrEmpty(ratingCommentDto.KlientName))
            {
                return BadRequest(new { message = "KlientName is required." });
            }

            var ratingComment = new RatingComment
            {
                Rating = ratingCommentDto.Rating,
                Comment = ratingCommentDto.Comment,
                KlientID = ratingCommentDto.KlientID,
                LibriID = ratingCommentDto.LibriID
            };

            _context.RatingComments.Add(ratingComment);
            await _context.SaveChangesAsync();

            var newRatingComment = await _context.RatingComments
                                                 .Include(rc => rc.Klient)
                                                 .Include(rc => rc.Libri)
                                                 .Select(rc => new RatingCommentDto
                                                 {
                                                     RatingsCommentID = rc.RatingsCommentID,
                                                     Rating = rc.Rating,
                                                     Comment = rc.Comment,
                                                     KlientID = rc.KlientID,
                                                     KlientName = rc.Klient.Emri + " " + rc.Klient.Mbiemri,
                                                     LibriID = rc.LibriID,
                                                     LibriTitle = rc.Libri.Titulli
                                                 })
                                                 .FirstOrDefaultAsync(rc => rc.RatingsCommentID == ratingComment.RatingsCommentID);

            return CreatedAtAction("GetRatingComment", new { id = newRatingComment.RatingsCommentID }, newRatingComment);
        }


        // PUT: api/RatingComment/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRatingComment(int id, RatingCommentDto ratingCommentDto)
        {
            if (id != ratingCommentDto.RatingsCommentID)
            {
                return BadRequest();
            }

            var ratingComment = await _context.RatingComments.FindAsync(id);

            if (ratingComment == null)
            {
                return NotFound();
            }

            ratingComment.Rating = ratingCommentDto.Rating;
            ratingComment.Comment = ratingCommentDto.Comment;
            ratingComment.KlientID = ratingCommentDto.KlientID;
            ratingComment.LibriID = ratingCommentDto.LibriID; 

            _context.Entry(ratingComment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RatingCommentExists(id))
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

        // DELETE: api/RatingComment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRatingComment(int id)
        {
            var ratingComment = await _context.RatingComments.FindAsync(id);
            if (ratingComment == null)
            {
                return NotFound();
            }

            _context.RatingComments.Remove(ratingComment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RatingCommentExists(int id)
        {
            return _context.RatingComments.Any(e => e.RatingsCommentID == id);
        }

    }
}