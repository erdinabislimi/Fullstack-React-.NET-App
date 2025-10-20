namespace labback.Models
{
    public class PaymentConfirmationRequest
    {
        public string KlientId { get; set; }
        public string PaymentIntentId { get; set; }
        public decimal Amount { get; set; }
    }
}
