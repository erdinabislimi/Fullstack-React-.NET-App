
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace labback.Models
{
    public class Klient
    {
        public int ID { get; set; }
        public string Emri { get; set; }
        public string Mbiemri { get; set; }
        public int NrPersonal { get; set; }
        public string Email { get; set; }
        public string Adresa { get; set; }
        public string Statusi { get; set; }
        public int NrTel { get; set; }
        public string Password { get; set; }
        public string? ProfilePicturePath { get; set; }
        [NotMapped]
        public string ProfilePictureUrl { get; set; }
        public int QytetiID { get; set; }
        public Qyteti Qyteti { get; set; }
        [JsonIgnore]
        public ICollection<RefreshToken> RefreshTokens { get; set; }

        public int RoliID { get; set; } 
        public Roli Roli { get; set; } 
        public ICollection<RatingComment> RatingComments { get; set; }
        public ICollection<EventRSVP> EventRSVPs { get; set; }
        public ICollection<Payment> Payments { get; set; }
        public ICollection<PaymentTransaction> PaymentTransactions { get; set; }
    }
}
