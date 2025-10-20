

    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    namespace labback.Models
    {
        public class Payment
        {
            public int PaymentId { get; set; }
            public int KlientId { get; set; } 
            public decimal Amount { get; set; }
            public string PaymentStatus { get; set; }
            public DateTime PaymentDate { get; set; }
            public DateTime ValidUntil { get; set; }

            public Klient Klient { get; set; }
        public string StripePaymentMethodId { get; set; }
    }
    }

