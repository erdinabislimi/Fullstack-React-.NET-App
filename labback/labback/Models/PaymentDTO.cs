using System.ComponentModel.DataAnnotations;

namespace labback.Models
{
 
    public class PaymentDto
    {
        public int KlientId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime PaymentDate { get; set; }
        public DateTime ValidUntil { get; set; }
        public string StripePaymentMethodId { get; set; }


    }
}
