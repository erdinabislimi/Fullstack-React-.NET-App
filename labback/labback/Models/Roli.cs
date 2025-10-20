namespace labback.Models
{
    public class Roli
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public ICollection<Klient> Klients { get; set; }
    }
}
