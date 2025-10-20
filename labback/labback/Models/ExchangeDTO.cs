namespace labback.Models
{
    public class ExchangeDTO
    {
        public int ExchangeId { get; set; }
        public int KlientId { get; set; } 
        public int LibriId { get; set; } 
        public int NrPersonal { get; set; }

        public string Status { get; set; }
        public DateTime ExchangeDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public bool IsApproved { get; set; }



    }
}
