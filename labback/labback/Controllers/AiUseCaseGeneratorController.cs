using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using labback.Models;

namespace labback.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiUseCaseGeneratorController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public AiUseCaseGeneratorController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpPost]
        public async Task<IActionResult> Generate([FromBody] UseCaseRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Description))
                return BadRequest("Description cannot be empty.");

            // Kjo është përgjigje e simuluar (mock), për testim pa API key
            var mock = new
            {
                actors = new[] { "User", "Admin" },
                use_cases = new[]
                {
            new { title = "Register Account", actor = "User", description = "User creates a new account" },
            new { title = "Borrow Book", actor = "User", description = "User borrows a book from the library" },
            new { title = "Return Book", actor = "User", description = "User returns a borrowed book" },
            new { title = "Add Book", actor = "Admin", description = "Admin adds new books to the system" },
            new { title = "Manage Users", actor = "Admin", description = "Admin manages library user accounts" }
        }
            };

            // Simulo "përgjigje" si të vinte nga modeli
            await Task.Delay(500); // (opsionale) vonesë për realizëm
            return Ok(mock);
        }
        [HttpPost("evaluate")]
        public IActionResult EvaluateGeneratedUseCases([FromBody] UseCaseEvaluationRequest req)
        {
            // 1. Rezultatet reale nga API
            var generated = req.Generated; // nga AiUseCaseGenerator
            var expected = req.Expected;   // manualisht (ground truth)

            int correct = generated.Use_Cases
                .Count(g => expected.Use_Cases.Any(e => e.Title.Equals(g.Title, StringComparison.OrdinalIgnoreCase)));

            double accuracy = (double)correct / expected.Use_Cases.Count * 100;

            return Ok(new
            {
                total_expected = expected.Use_Cases.Count,
                total_correct = correct,
                accuracy = $"{accuracy:F2}%",
                generated_actors = generated.Actors,
                generated_use_cases = generated.Use_Cases
            });
        }

    }

    public class UseCaseRequest
    {
        public string Description { get; set; }
    }
}
