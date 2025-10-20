namespace labback.Models
{
    public class PaymentConfirmationDTO
    {
        public int KlientId { get; set; }
        public string PaymentIntentId { get; set; }
        public string PaymentMethodId { get; set; }
    }
}
