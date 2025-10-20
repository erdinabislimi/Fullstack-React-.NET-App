
namespace labback.Models
{
    public class Exchange
    {
        public int ExchangeId { get; set; }


        public int KlientId { get; set; }
        public Klient Klient { get; set; }


        public int LibriId { get; set; }
        public Libri Libri { get; set; }

        public string Status { get; set; } 

        public DateTime ExchangeDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public bool IsApproved { get; set; } 

        public ICollection<Notification> Notifications { get; set; }
        public virtual ICollection<Payment> Payments { get; set; } 


    }
}
