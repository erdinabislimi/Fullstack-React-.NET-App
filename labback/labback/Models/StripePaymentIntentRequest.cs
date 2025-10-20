namespace labback.Models
{
    public class StripePaymentIntentRequest
    {
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "eur"; 
        public string PaymentMethodType { get; set; } = "card"; 
    }
}
