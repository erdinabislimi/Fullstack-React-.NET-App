namespace labback.Models
{
    public class StripeWebhookEvent
    {
        public string EventType { get; set; }
        public string PaymentIntentId { get; set; }
        public string Status { get; set; }
    }
}
