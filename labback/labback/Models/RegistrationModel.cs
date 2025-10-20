using Microsoft.AspNetCore.Http;

namespace labback.Models
{
    public class RegistrationModel
    {
        public string Emri { get; set; }
        public string Mbiemri { get; set; }
        public int NrPersonal { get; set; }
        public string Email { get; set; }
        public string Adresa { get; set; }
        public string Statusi { get; set; }
        public int NrTel { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public IFormFile? ProfilePicturePath { get; set; }
        public int QytetiID { get; set; }
    }
}
