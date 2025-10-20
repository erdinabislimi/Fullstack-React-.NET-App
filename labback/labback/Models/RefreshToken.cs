using System;
using System.Text.Json.Serialization;

namespace labback.Models
{
    public class RefreshToken
    {
        public int ID { get; set; }
        public string Token { get; set; }
        public DateTime Expires { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expires;
        public DateTime Created { get; set; }
        public DateTime? Revoked { get; set; }
        public bool IsActive => Revoked == null && !IsExpired;

        public int KlientID { get; set; }
        [JsonIgnore]
        public Klient Klient { get; set; }
    }
}
