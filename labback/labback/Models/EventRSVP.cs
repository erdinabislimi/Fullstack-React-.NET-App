namespace labback.Models
{
    public class EventRSVP
    {
        public int EventRSVPId { get; set; }

        public int KlientId { get; set; }
        public int EventId { get; set; }

        public Klient Klient { get; set; }
        public Event Event { get; set; }
    }
}
