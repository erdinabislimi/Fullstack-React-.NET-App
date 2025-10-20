using labback.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace labback.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZhanriController : ControllerBase
    {
        private readonly LibriContext _libri;

        public ZhanriController(LibriContext libriContext)
        {
            _libri = libriContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Zhanri>>> GetZhanri()
        {
            var zhanri = await _libri.zhanri.ToListAsync();
            if (zhanri == null)
            {
                return NotFound();
            }
            return zhanri;
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<Zhanri>> GetZhanri(int Id)
        {
            var zhanri = await _libri.zhanri.FindAsync(Id);
            if (zhanri == null)
            {
                return NotFound();
            }
            return zhanri;
        }

        [HttpPost]
        public async Task<ActionResult<ShtepiaBotuese>> PostZhanri(Zhanri zhanri)
        {
           
            _libri.zhanri.Add(zhanri);
            await _libri.SaveChangesAsync();

            return CreatedAtAction(nameof(GetZhanri), new { Id = zhanri.zhanriId }, zhanri);
        }


        [HttpPut("{Id}")]
        public async Task<ActionResult> PutZhanri(int Id, Zhanri zhanri)
        {
            if (Id != zhanri.zhanriId)
            {
                return BadRequest();
            }

            _libri.Entry(zhanri).State = EntityState.Modified;
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
        public async Task<ActionResult> DeleteZhanri(int Id)
        {
            var zhanri = await _libri.zhanri.FindAsync(Id);
            if (zhanri == null)
            {
                return NotFound();
            }
            _libri.zhanri.Remove(zhanri);
            await _libri.SaveChangesAsync();
            return Ok();
        }
    }
}
