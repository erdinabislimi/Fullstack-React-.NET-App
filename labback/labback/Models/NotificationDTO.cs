namespace labback.Models
{
    public class NotificationDTO
    {
        public int notificationId { get; set; }
        public string message { get; set; }
        public bool isRead { get; set; }
        public int? klientId { get; set; } 
        public int? exchangeId { get; set; }
        public DateTime notificationTime { get; set; }
        public string titulli { get; set; }
    }
}