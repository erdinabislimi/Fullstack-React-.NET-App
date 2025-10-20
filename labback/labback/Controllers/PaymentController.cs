using labback.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace labback.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly LibriContext _context;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(LibriContext context, ILogger<PaymentController> logger)
        {
            _context = context;
            _logger = logger;
        }
        [HttpPost]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentDto paymentDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                                              .Select(e => e.ErrorMessage);
                _logger.LogError("Validation errors: {Errors}", string.Join(", ", errors));
                return BadRequest(errors);
            }

            _logger.LogInformation("Received payment request: {@PaymentDto}", paymentDto);

            var klient = await _context.Klients.FindAsync(paymentDto.KlientId);
            if (klient == null)
            {
                _logger.LogError("Invalid KlientId: {KlientId}", paymentDto.KlientId);
                return BadRequest("Invalid KlientId. Client not found.");
            }

            var existingPayment = await _context.Payments
                .FirstOrDefaultAsync(p => p.KlientId == paymentDto.KlientId &&
                                          p.PaymentStatus == "Completed" &&
                                          p.ValidUntil >= DateTime.UtcNow);

            _logger.LogInformation("Existing payment check: {ExistingPayment}", existingPayment);

            if (existingPayment != null)
            {
                _logger.LogWarning("Active membership exists for KlientId: {KlientId}", paymentDto.KlientId);
                return Conflict(new
                {
                    Message = "You are already a member.",
                    ValidUntil = existingPayment.ValidUntil
                });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                if (string.IsNullOrWhiteSpace(paymentDto.StripePaymentMethodId))
                    return BadRequest("Stripe PaymentMethodId is required.");

                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)(paymentDto.Amount * 100),
                    Currency = "usd",
                    PaymentMethod = paymentDto.StripePaymentMethodId,
                    PaymentMethodTypes = new List<string> { "card" },
                    ConfirmationMethod = "automatic",
                    Confirm = true
                };

                var service = new PaymentIntentService();
                var paymentIntent = await service.CreateAsync(options);

                if (paymentIntent.Status == "succeeded")
                {
                    var payment = new Payment
                    {
                        KlientId = paymentDto.KlientId,
                        Amount = paymentDto.Amount,
                        PaymentStatus = "Completed",
                        PaymentDate = DateTime.UtcNow,
                        ValidUntil = DateTime.UtcNow.AddYears(1),
                        StripePaymentMethodId = paymentDto.StripePaymentMethodId
                    };

                    await _context.Payments.AddAsync(payment);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();
                    _logger.LogInformation("Payment processed successfully for KlientId: {KlientId}", paymentDto.KlientId);
                    return CreatedAtAction(nameof(GetPayment), new { id = payment.PaymentId }, payment);
                }

                if (paymentIntent.Status == "requires_action" || paymentIntent.Status == "requires_payment_method")
                {
                    await transaction.RollbackAsync();
                    return BadRequest($"Payment requires additional actions: {paymentIntent.NextAction?.Type ?? "Unknown"}");
                }

                await transaction.RollbackAsync();
                return BadRequest($"Payment failed with status: {paymentIntent.Status}");
            }
            catch (StripeException stripeEx)
            {
                await transaction.RollbackAsync();
                _logger.LogError(stripeEx, "Stripe Error: {Message}", stripeEx.Message);
                return BadRequest($"Stripe Error: {stripeEx.Message}");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Internal Server Error: {Message}", ex.Message);
                return StatusCode(500, "An unexpected error occurred while processing the payment.");
            }
        }



        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
        {
            try
            {
                var payments = await _context.Payments.Include(p => p.Klient).ToListAsync();
                return Ok(payments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving payments.");
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpPost("Payment")]
        public async Task<IActionResult> SavePayment([FromBody] PaymentDto paymentDto)
        {
            try
            {
                if (paymentDto == null)
                {
                    return BadRequest("Payment data is missing.");
                }

                Console.WriteLine($"Received Payment: {paymentDto.Amount} {paymentDto.StripePaymentMethodId} ");

                var payment = new Payment
                {
                    KlientId = paymentDto.KlientId,
                    Amount = paymentDto.Amount,
                    PaymentStatus = paymentDto.PaymentStatus,
                    ValidUntil = DateTime.UtcNow.AddYears(1),  
                    PaymentDate = DateTime.UtcNow,
                    StripePaymentMethodId = paymentDto.StripePaymentMethodId
                };

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Payment data saved successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving payment: {ex.Message}");
                return StatusCode(500, $"Error saving payment: {ex.Message}");
            }
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            try
            {
                var payment = await _context.Payments.Include(p => p.Klient)
                                                     .FirstOrDefaultAsync(p => p.PaymentId == id);

                if (payment == null)
                    return NotFound("Payment not found.");

                return Ok(payment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving payment with ID {id}.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePayment(int id, [FromBody] Payment payment)
        {
            if (id != payment.PaymentId)
                return BadRequest("Payment ID mismatch.");

            var existingPayment = await _context.Payments.FindAsync(id);
            if (existingPayment == null)
                return NotFound();

            existingPayment.Amount = payment.Amount;
            existingPayment.PaymentStatus = payment.PaymentStatus;
            existingPayment.ValidUntil = payment.ValidUntil;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentExists(id))
                    return NotFound();

                throw;
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
                return NotFound();

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymentExists(int id)
        {
            return _context.Payments.Any(p => p.PaymentId == id);
        }
        [HttpPost("PaymentIntent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentDto paymentDto)
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(paymentDto.Amount * 100), 
                PaymentMethodTypes = new List<string> { "card" },
                ConfirmationMethod = "manual",
                Confirm = false,
            };

            var service = new PaymentIntentService();
            var paymentIntent = await service.CreateAsync(options);

            return Ok(new { clientSecret = paymentIntent.ClientSecret });
        }

    }
}
