using System;

namespace labback.Models
{
    public class PaymentTransaction
    {
        public int Id { get; set; } 
        public int KlientId { get; set; }
        public Klient Klient { get; set; } 
        public decimal Amount { get; set; } 
        public string TransactionId { get; set; } 
        public DateTime CreatedAt { get; set; } 
        public string Status { get; set; } 
    }
}
