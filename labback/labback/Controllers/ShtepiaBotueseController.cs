using labback.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace labback.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShtepiaBotueseController : ControllerBase
    {
        private readonly LibriContext _libri;

        public ShtepiaBotueseController(LibriContext libriContext)
        {
            _libri = libriContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShtepiaBotuese>>> GetShtepiaBotuese()
        {
            var shtepiaBotuese = await _libri.ShtepiteBotuese.ToListAsync();
            if (shtepiaBotuese == null)
            {
                return NotFound();
            }
            return shtepiaBotuese;
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<ShtepiaBotuese>> GetShtepiaBotuese(int Id)
        {
            var shtepia = await _libri.ShtepiteBotuese.FindAsync(Id);
            if (shtepia == null)
            {
                return NotFound();
            }
            return shtepia;
        }

        [HttpPost]
        public async Task<ActionResult<ShtepiaBotuese>> PostShtepiaBotuese(ShtepiaBotuese shtepiaBotuese)
        {
            _libri.ShtepiteBotuese.Add(shtepiaBotuese);
            await _libri.SaveChangesAsync();

            return CreatedAtAction(nameof(GetShtepiaBotuese), new { Id = shtepiaBotuese.ShtepiaBotueseID }, shtepiaBotuese);
        }


        [HttpPut("{Id}")]
        public async Task<ActionResult> PutShtepiaBotuese(int Id, ShtepiaBotuese shtepiaBotuese)
        {
            if (Id != shtepiaBotuese.ShtepiaBotueseID)
            {
                return BadRequest();
            }

            _libri.Entry(shtepiaBotuese).State = EntityState.Modified;
            try
            {
                await _libri.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return Ok();
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> DeleteShtepineBotuese(int Id)
        {
            var shtepiaBotuese = await _libri.ShtepiteBotuese.FindAsync(Id);
            if (shtepiaBotuese == null)
            {
                return NotFound();
            }
            _libri.ShtepiteBotuese.Remove(shtepiaBotuese);
            await _libri.SaveChangesAsync();
            return Ok();
        }
    }
}
