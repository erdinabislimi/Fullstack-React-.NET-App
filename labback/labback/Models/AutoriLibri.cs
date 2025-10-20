namespace labback.Models
{
    public class AutoriLibri
    {
        public int Autori_ID { get; set; }
        public Autori Autoret { get; set; }

        public int ID { get; set; }
        public Libri Librat { get; set; }
    }
}
