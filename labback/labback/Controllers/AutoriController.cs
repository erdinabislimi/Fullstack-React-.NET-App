

using labback.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace labback.Models
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutoriController : ControllerBase
    {

        public readonly LibriContext _LibriContext;
        public AutoriController(LibriContext LibriContext) {

            _LibriContext = LibriContext;
        }
        [HttpGet("getAll")]
        public async Task<ActionResult<IEnumerable<Autori>>> getAutoret()
        {
            if (_LibriContext.Autori == null) {
                return NotFound("Autoret nuk ekzitojn!");
            }

            return await _LibriContext.Autori.ToListAsync();
        }

        [HttpGet("getByID/{Autori_ID}")]
        public async Task<ActionResult<AutoriDTO>> getAutoret(int Autori_ID)
        {
            var autori = await _LibriContext.Autori.FindAsync(Autori_ID);

            if (autori == null)
            {
                return NotFound("Nuk ekziston sipas asaj ID");
            }

            var autoriDTO = new AutoriDTO
            {
                Emri = autori.Emri,
                Mbiemri = autori.Mbiemri,
                Nofka = autori.nofka,
                Gjinia = autori.gjinia,
                Data_E_Lindjes = autori.Data_E_Lindjes,
                Nacionaliteti = autori.Nacionaliteti
            };

            return autoriDTO;
        }

        [HttpPost]
        public async Task<ActionResult<Autori>> addAutori(AutoriDTO DTO) {
            var autori = new Autori
            {
                Emri = DTO.Emri,
                Mbiemri = DTO.Mbiemri,
                nofka = DTO.Nofka,
                gjinia = DTO.Gjinia,
                Data_E_Lindjes = DTO.Data_E_Lindjes,
                Nacionaliteti = DTO.Nacionaliteti
            };

            _LibriContext.Autori.Add(autori);
            await _LibriContext.SaveChangesAsync();

            return CreatedAtAction(nameof(getAutoret), new { id = autori.Autori_ID }, autori);
        }

        [HttpPut("update/{Autori_ID}")]
        public async Task<ActionResult> PutAutori(int Autori_ID, AutoriDTO DTO)
        {
            var autori = await _LibriContext.Autori.FindAsync(Autori_ID);

            if (autori == null)
            {
                return NotFound();
            }

            autori.Emri = DTO.Emri;
            autori.Mbiemri = DTO.Mbiemri;
            autori.nofka = DTO.Nofka;
            autori.gjinia = DTO.Gjinia;
            autori.Data_E_Lindjes = DTO.Data_E_Lindjes;
            autori.Nacionaliteti = DTO.Nacionaliteti;

            await _LibriContext.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("delete/{Autori_ID}")]
        public async Task<ActionResult> deleteAutori(int Autori_ID)
        {
            if (_LibriContext.Autori == null)
                return NotFound();
            var autori = await _LibriContext.Autori.FindAsync(Autori_ID);
            if (autori == null)
                return NotFound();
            _LibriContext.Autori.Remove(autori);
            await _LibriContext.SaveChangesAsync();

            return Ok();

        }

        //AUTORI-LIBRI CONNECTION CODES
        [HttpGet("librat/{Autori_ID}")]
        public async Task<ActionResult<IEnumerable<Libri>>> LibratPrejAutorit(int Autori_ID)
        {

            var librat = await _LibriContext.AutoriLibris
            .Where(al => al.Autori_ID == Autori_ID)
            .Include(al => al.Librat)
            .Select(al => al.Librat)
            .ToListAsync();

            return librat;
        }

        [HttpGet("librat/{Autori_ID}/count")]
        public async Task<ActionResult<int>> GetLibratCountPrejAutorit(int Autori_ID)
        {
            var libratCount = await _LibriContext.AutoriLibris
                .CountAsync(al => al.Autori_ID == Autori_ID);

            return libratCount;
        }

    }
}
