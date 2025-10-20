namespace labback.Models
{
    public class Notification
    {
        public int notificationId { get; set; }
        public string message { get; set; }
        public bool isRead { get; set; }

        public int? klientId { get; set; }
        public Klient? klient { get; set; } 

        public int? exchangeId { get; set; }
        public Exchange? exchange { get; set; } 

        public DateTime notificationTime { get; set; }
    }
}
