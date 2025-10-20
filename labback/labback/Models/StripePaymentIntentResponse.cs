namespace labback.Models
{
    public class StripePaymentIntentResponse
    {
        public string ClientSecret { get; set; }
        public string PaymentIntentId { get; set; }
    }
}
