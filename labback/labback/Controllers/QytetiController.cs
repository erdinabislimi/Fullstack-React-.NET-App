using labback.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace labback.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QytetiController : ControllerBase
    {
        private readonly LibriContext _context;

        public QytetiController(LibriContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Qyteti>>> GetQytetet()
        {
            var qytetet = await _context.Qytetet.ToListAsync();
            if (qytetet == null || !qytetet.Any())
            {
                return NotFound();
            }
            return qytetet;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Qyteti>> GetQyteti(int id)
        {
            var qyteti = await _context.Qytetet.FindAsync(id);
            if (qyteti == null)
            {
                return NotFound();
            }
            return qyteti;
        }

        [HttpPost]
        public async Task<ActionResult<Qyteti>> PostQyteti(Qyteti qyteti)
        {
            _context.Qytetet.Add(qyteti);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetQyteti), new { id = qyteti.ID }, qyteti);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutQyteti(int id, Qyteti qyteti)
        {
            if (id != qyteti.ID)
            {
                return BadRequest();
            }

            _context.Entry(qyteti).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteQyteti(int id)
        {
            var qyteti = await _context.Qytetet.FindAsync(id);
            if (qyteti == null)
            {
                return NotFound();
            }

            _context.Qytetet.Remove(qyteti);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
