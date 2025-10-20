using labback.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BCrypt.Net;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System;
using System.Security.Cryptography;
using Microsoft.Extensions.Hosting.Internal;

namespace labback.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KlientController : ControllerBase
    {
        private readonly LibriContext _LibriContext;
        private readonly ILogger<KlientController> _logger;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly string _jwtKey;

        public KlientController(LibriContext LibriContext, ILogger<KlientController> logger, IWebHostEnvironment hostingEnvironment, string jwtKey)
        {
            _LibriContext = LibriContext;
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
            _jwtKey = jwtKey;
        }
        [HttpGet]
        public async Task<IActionResult> GetKlients()
        {
            var klients = await _LibriContext.Klients.Include(k => k.Qyteti).ToListAsync();
            var baseUrl = $"{Request.Scheme}://{Request.Host}/foto/";

            foreach (var klient in klients)
            {
                klient.ProfilePictureUrl = $"{baseUrl}{klient.ProfilePicturePath}";
            }

            return Ok(klients);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetKlient(int id)
        {
            var klient = await _LibriContext.Klients.Include(k => k.Qyteti).FirstOrDefaultAsync(k => k.ID == id);
            if (klient == null)
            {
                return NotFound();
            }

            var baseUrl = $"{Request.Scheme}://{Request.Host}/foto/";
            klient.ProfilePictureUrl = $"{baseUrl}{klient.ProfilePicturePath}";

            return Ok(klient);
        }


        [HttpGet("with-roles")]
        public async Task<IActionResult> GetKlientsWithRoles()
        {
            var klients = await _LibriContext.Klients
                .Include(k => k.Qyteti)
                .Include(k => k.Roli)
                .ToListAsync();

            var baseUrl = $"{Request.Scheme}://{Request.Host}/foto/";

            var klientDtos = klients.Select(k => new
            {
                k.ID,
                k.Emri,
                k.Mbiemri,
                k.NrPersonal,
                k.Email,
                k.Adresa,
                k.Statusi,
                k.NrTel,
                k.Password,
                ProfilePictureUrl = !string.IsNullOrEmpty(k.ProfilePicturePath) ? $"{baseUrl}{k.ProfilePicturePath}" : null,
                QytetiEmri = k.Qyteti.Emri,
                RoliName = k.Roli.Name 
            });

            return Ok(klientDtos);
        }

        [HttpPost]
        public async Task<ActionResult<Klient>> PostKlient([FromForm] RegistrationModel model)
        {
            if (ModelState.IsValid)
            {
                string uniqueFileName = null;

                if (model.ProfilePicturePath != null && model.ProfilePicturePath.Length > 0)
                {
                    string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "foto");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(model.ProfilePicturePath.FileName);
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.ProfilePicturePath.CopyToAsync(fileStream);
                    }
                }

               
                var adminEmails = new List<string> { "erdina@gmail.com", "delfina@gmail.com", "loran@gmail.com", "jon@gmail.com" };
                int roliID = adminEmails.Contains(model.Email) ? 2 : 1; 

                Klient klient = new Klient
                {
                    Emri = model.Emri,
                    Mbiemri = model.Mbiemri,
                    NrPersonal = model.NrPersonal,
                    Email = model.Email,
                    Adresa = model.Adresa,
                    Statusi = model.Statusi,
                    NrTel = model.NrTel,
                    Password = BCrypt.Net.BCrypt.HashPassword(model.Password),
                    ProfilePicturePath = uniqueFileName,
                    QytetiID = model.QytetiID,
                    RoliID = roliID 
                };

                _LibriContext.Klients.Add(klient);
                await _LibriContext.SaveChangesAsync();

                
                klient = await _LibriContext.Klients
                    .Include(k => k.Qyteti)
                    .Include(k => k.Roli)
                    .FirstOrDefaultAsync(k => k.ID == klient.ID);
                if (!string.IsNullOrEmpty(klient.ProfilePicturePath))
                {
                    klient.ProfilePictureUrl = $"{Request.Scheme}://{Request.Host}/foto/{klient.ProfilePicturePath}";
                }

                return CreatedAtAction(nameof(GetKlient), new { id = klient.ID }, new
                {
                    klient.ID,
                    klient.Emri,
                    klient.Mbiemri,
                    klient.NrPersonal,
                    klient.Email,
                    klient.Adresa,
                    klient.Statusi,
                    klient.NrTel,
                    klient.ProfilePictureUrl,
                    QytetiEmri = klient.Qyteti.Emri, 
                    RoliName = klient.Roli.Name 
                });
            }

            return BadRequest(ModelState);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutKlient(int id, [FromForm] RegistrationModel model)
        {
            var klient = await _LibriContext.Klients.FindAsync(id);
            if (klient == null)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                klient.Emri = model.Emri;
                klient.Mbiemri = model.Mbiemri;
                klient.NrPersonal = model.NrPersonal;
                klient.Email = model.Email;
                klient.Adresa = model.Adresa;
                klient.Statusi = model.Statusi;
                klient.NrTel = model.NrTel;
                klient.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);
                klient.QytetiID = model.QytetiID;

                if (model.ProfilePicturePath != null && model.ProfilePicturePath.Length > 0)
                {
                    string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "foto");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    if (!string.IsNullOrEmpty(klient.ProfilePicturePath))
                    {
                        var oldFilePath = Path.Combine(uploadsFolder, klient.ProfilePicturePath);
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }

                    string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(model.ProfilePicturePath.FileName);
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.ProfilePicturePath.CopyToAsync(fileStream);
                    }

                    klient.ProfilePicturePath = uniqueFileName;
                }

                _LibriContext.Entry(klient).State = EntityState.Modified;
                await _LibriContext.SaveChangesAsync();

                return NoContent();
            }

            return BadRequest(ModelState);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKlient(int id)
        {
            var klient = await _LibriContext.Klients.FindAsync(id);
            if (klient == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(klient.ProfilePicturePath))
            {
                string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "foto");
                var filePath = Path.Combine(uploadsFolder, klient.ProfilePicturePath);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _LibriContext.Klients.Remove(klient);
            await _LibriContext.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("count")]
        public IActionResult GetKlientCount()
        {
            try
            {
                var klientCount = _LibriContext.Klients.Count();
                return Ok(new { count = klientCount });
            }
            catch (Exception ex)
            {
               
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                _logger.LogInformation("Login attempt with email: {Email}", model.Email);

                var klient = await _LibriContext.Klients.Include(k => k.Roli).FirstOrDefaultAsync(k => k.Email == model.Email);
                if (klient == null || !BCrypt.Net.BCrypt.Verify(model.Password, klient.Password))
                {
                    _logger.LogWarning("Login failed: Invalid email or password");
                    return NotFound("Invalid email or password");
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                var keyBytes = Encoding.UTF8.GetBytes(_jwtKey);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                new Claim(ClaimTypes.NameIdentifier, klient.ID.ToString()),
                new Claim(ClaimTypes.Email, klient.Email),
                new Claim(ClaimTypes.Role, klient.Roli.Name),
                new Claim("KlientID", klient.ID.ToString()) 
                    }),
                    Expires = DateTime.UtcNow.AddMinutes(30), 
                    Issuer = "yourdomain.com",
                    Audience = "yourdomain.com",
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                var refreshToken = GenerateRefreshToken();
                refreshToken.KlientID = klient.ID;

                
                _LibriContext.RefreshTokens.Add(refreshToken);
                await _LibriContext.SaveChangesAsync();

                _logger.LogInformation("Login successful for email: {Email}", model.Email);

                return Ok(new
                {
                    Token = tokenString,
                    Expiration = tokenDescriptor.Expires,
                    RefreshToken = refreshToken.Token,
                    Roli = klient.Roli.Name 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during login");
                return StatusCode(500, "An error occurred during login");
            }
        }


        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] string requestRefreshToken)
        {
            if (string.IsNullOrEmpty(requestRefreshToken))
            {
                return Unauthorized("Refresh token is missing");
            }

            var existingToken = await _LibriContext.RefreshTokens
                .Include(rt => rt.Klient)
                .FirstOrDefaultAsync(rt => rt.Token == requestRefreshToken);

            if (existingToken == null || existingToken.Expires < DateTime.UtcNow)
            {
                HttpContext.Session.Remove("refreshToken");
                return Unauthorized("Invalid or expired refresh token");
            }

            var klient = existingToken.Klient;

            var tokenHandler = new JwtSecurityTokenHandler();
            var keyBytes = Encoding.UTF8.GetBytes(_jwtKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.NameIdentifier, klient.ID.ToString()),
            new Claim(ClaimTypes.Email, klient.Email)
        }),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            var newRefreshToken = GenerateRefreshToken();
            newRefreshToken.KlientID = klient.ID;

            _LibriContext.RefreshTokens.Add(newRefreshToken);
            _LibriContext.RefreshTokens.Remove(existingToken);
            await _LibriContext.SaveChangesAsync();

            _logger.LogInformation("Generated new Refresh Token: {Token}", newRefreshToken.Token);
            _logger.LogInformation("Refresh Token Expires at: {Expires}", newRefreshToken.Expires);

            HttpContext.Session.SetString("refreshToken", newRefreshToken.Token);

            return Ok(new
            {
                Token = tokenString,
                RefreshToken = newRefreshToken.Token
            });
        }



        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
        {
            var refreshToken = await _LibriContext.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);
            if (refreshToken != null)
            {
                _LibriContext.RefreshTokens.Remove(refreshToken);
                await _LibriContext.SaveChangesAsync();
            }

            HttpContext.Session.Remove("refreshToken");

            return Ok(new { message = "Logout successful" });
        }



        private RefreshToken GenerateRefreshToken()
                {
                    var randomBytes = new byte[32];
                    using (var rng = RandomNumberGenerator.Create())
                    {
                        rng.GetBytes(randomBytes);
                    }
                    return new RefreshToken
                    {
                        Token = Convert.ToBase64String(randomBytes),
                        Expires = DateTime.UtcNow.AddMinutes(30), 
                        Created = DateTime.UtcNow
                    };
                }

        [HttpPost("check-refresh-token")]
        public async Task<IActionResult> CheckRefreshToken([FromBody] string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest("Refresh token is missing");
            }

            var token = await _LibriContext.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == refreshToken);
            if (token != null)
            {
                return Ok(new { valid = true });
            }

            return Ok(new { valid = false });
        }


 
    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchKlient(int id, [FromForm] PartialUpdateKlientModel model)
    {
        var klient = await _LibriContext.Klients.FindAsync(id);
        if (klient == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrEmpty(model.Emri))
        {
            klient.Emri = model.Emri;
        }

        if (!string.IsNullOrEmpty(model.Mbiemri))
        {
            klient.Mbiemri = model.Mbiemri;
        }

        if (model.ProfilePicturePath != null && model.ProfilePicturePath.Length > 0)
        {
            string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "foto");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            if (!string.IsNullOrEmpty(klient.ProfilePicturePath))
            {
                var oldFilePath = Path.Combine(uploadsFolder, klient.ProfilePicturePath);
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }

            string uniqueFileName = Guid.NewGuid().ToString() + "" + Path.GetFileName(model.ProfilePicturePath.FileName);
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await model.ProfilePicturePath.CopyToAsync(fileStream);
            }

            klient.ProfilePicturePath = uniqueFileName;
        }

        _LibriContext.Entry(klient).State = EntityState.Modified;
        await _LibriContext.SaveChangesAsync();

        return NoContent();
    }

}
   }
